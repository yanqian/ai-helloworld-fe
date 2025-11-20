import type { Logger } from './logger';

export interface HttpClientConfig {
  baseUrl: string;
  logger: Logger;
  getAuthToken?: () => string | null;
  refreshSession?: () => Promise<boolean>;
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
  if (!baseUrl) {
    return path;
  }
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

const buildHeaders = (
  base: Record<string, string>,
  getAuthToken?: () => string | null,
): Record<string, string> => {
  const headers = { ...base };
  const token = getAuthToken?.();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
};

const shouldAttemptRefresh = (status: number) => status === 401 || status === 403;

export const createHttpClient = ({
  baseUrl,
  logger,
  getAuthToken,
  refreshSession,
}: HttpClientConfig): HttpClient => {
  const performRequest = async (makeRequest: () => Promise<Response>): Promise<Response> => {
    let response = await makeRequest();
    if (shouldAttemptRefresh(response.status) && refreshSession) {
      const refreshed = await refreshSession();
      if (refreshed) {
        response = await makeRequest();
      }
    }
    return response;
  };

  const get = async <TResponse>(path: string, signal?: AbortSignal) => {
    const url = buildUrl(baseUrl, path);
    try {
      const response = await performRequest(() =>
        fetch(url, {
          method: 'GET',
          headers: buildHeaders({}, getAuthToken),
          signal,
        }),
      );

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
      const response = await performRequest(() =>
        fetch(url, {
          method: 'POST',
          headers: buildHeaders({ 'Content-Type': 'application/json' }, getAuthToken),
          body: JSON.stringify(body),
          signal,
        }),
      );

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
      const response = await performRequest(() =>
        fetch(url, {
          method: 'POST',
          headers: buildHeaders({ 'Content-Type': 'application/json' }, getAuthToken),
          body: JSON.stringify(body),
          signal,
        }),
      );

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
