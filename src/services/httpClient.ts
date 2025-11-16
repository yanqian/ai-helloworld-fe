import type { Logger } from './logger';

export interface HttpClientConfig {
  baseUrl: string;
  logger: Logger;
}

export interface HttpClient {
  get<TResponse>(path: string, signal?: AbortSignal): Promise<TResponse>;
  post<TResponse>(path: string, body: unknown, signal?: AbortSignal): Promise<TResponse>;
  stream(
    path: string,
    body: unknown,
    onChunk: (chunk: string) => void,
    signal?: AbortSignal,
  ): Promise<void>;
}

const buildUrl = (baseUrl: string, path: string): string => {
  return `${baseUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
};

const extractErrorPayload = async (response: Response) => {
  const raw = await response
    .text()
    .catch(() => '')
    .then((text) => text.trim());

  if (!raw) {
    return undefined;
  }

  try {
    return JSON.parse(raw);
  } catch {
    return { message: raw };
  }
};

const buildErrorMessage = (status: number, payload?: unknown): string => {
  if (payload && typeof payload === 'object') {
    const errorPayload = payload as { error?: { message?: string }; message?: string };
    if (errorPayload?.error?.message) {
      return errorPayload.error.message;
    }
    if (errorPayload?.message) {
      return errorPayload.message;
    }
  }

  return `Request failed with status ${status}`;
};

export const createHttpClient = ({ baseUrl, logger }: HttpClientConfig): HttpClient => {
  const get = async <TResponse>(path: string, signal?: AbortSignal) => {
    const url = buildUrl(baseUrl, path);
    try {
      const response = await fetch(url, { method: 'GET', signal });

      if (!response.ok) {
        const errorPayload = await extractErrorPayload(response);
        logger.log('error', 'HTTP request failed', {
          path,
          status: response.status,
          errorPayload,
        });

        throw new Error(buildErrorMessage(response.status, errorPayload));
      }

      return (await response.json()) as TResponse;
    } catch (error) {
      logger.log('error', 'HTTP request error', {
        path,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error instanceof Error ? error : new Error('Network request failed');
    }
  };

  const post = async <TResponse>(path: string, body: unknown, signal?: AbortSignal) => {
    const url = buildUrl(baseUrl, path);
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal,
      });

      if (!response.ok) {
        const errorPayload = await extractErrorPayload(response);
        logger.log('error', 'HTTP request failed', {
          path,
          status: response.status,
          errorPayload,
        });

        throw new Error(buildErrorMessage(response.status, errorPayload));
      }

      return (await response.json()) as TResponse;
    } catch (error) {
      logger.log('error', 'HTTP request error', {
        path,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error instanceof Error ? error : new Error('Network request failed');
    }
  };

  const stream = async (
    path: string,
    body: unknown,
    onChunk: (chunk: string) => void,
    signal?: AbortSignal,
  ) => {
    const url = buildUrl(baseUrl, path);
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal,
      });

      if (!response.ok || !response.body) {
        const errorPayload = !response.body ? undefined : await extractErrorPayload(response);
        logger.log('error', 'Stream request failed', {
          path,
          status: response.status,
          errorPayload,
        });
        throw new Error(buildErrorMessage(response.status, errorPayload));
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let isDone = false;
      while (!isDone) {
        const { value, done } = await reader.read();
        if (done) {
          isDone = true;
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        onChunk(chunk);
      }
    } catch (error) {
      logger.log('error', 'Stream request error', {
        path,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error instanceof Error ? error : new Error('Network request failed');
    }
  };

  return { get, post, stream };
};
