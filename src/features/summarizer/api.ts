import type { HttpClient } from '@/services/httpClient';
import type { Logger } from '@/services/logger';
import type { StreamChunk, SummarizePayload, SummaryResponse } from './types';

const SYNC_PATH = '/api/v1/summaries';
const STREAM_PATH = '/api/v1/summaries/stream';

const parseSseChunk = (raw: string): StreamChunk[] => {
  return raw
    .split('\n\n')
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => block.replace(/^data:\s*/, ''))
    .map((json) => JSON.parse(json) as Record<string, unknown>)
    .map((chunk) => ({
      partialSummary:
        (chunk.partialSummary as string) ??
        (chunk.partial_summary as string) ??
        (chunk.summary as string) ??
        '',
      completed: Boolean(chunk.completed),
      keywords: Array.isArray(chunk.keywords)
        ? (chunk.keywords as string[])
        : undefined,
    }));
};

export interface SummarizerApi {
  summarize: (payload: SummarizePayload, signal?: AbortSignal) => Promise<SummaryResponse>;
  streamSummary: (
    payload: SummarizePayload,
    handlers: {
      onChunk: (chunk: StreamChunk) => void;
      onError: (error: Error) => void;
      onComplete: () => void;
    },
    signal?: AbortSignal,
  ) => Promise<void>;
}

export const createSummarizerApi = (httpClient: HttpClient, logger: Logger): SummarizerApi => ({
  summarize: (payload, signal) => httpClient.post(SYNC_PATH, payload, signal),
  streamSummary: async (payload, handlers, signal) => {
    let buffer = '';

    try {
      await httpClient.stream(
        STREAM_PATH,
        payload,
        (rawChunk) => {
          buffer += rawChunk;
          const segments = buffer.split('\n\n');
          buffer = segments.pop() ?? '';

          segments.forEach((segment) => {
            try {
              const parsed = parseSseChunk(`${segment}\n\n`);
              parsed.forEach((chunk) => handlers.onChunk(chunk));
            } catch (error) {
              logger.log('warn', 'Failed to parse stream chunk', { error });
            }
          });
        },
        signal,
      );

      if (buffer.trim()) {
        try {
          const parsed = parseSseChunk(buffer);
          parsed.forEach((chunk) => handlers.onChunk(chunk));
        } catch (error) {
          logger.log('warn', 'Failed to parse trailing stream chunk', { error });
        }
      }

      handlers.onComplete();
    } catch (error) {
      handlers.onError(error as Error);
    }
  },
});

export const __testables = {
  parseSseChunk,
};
