import { useCallback, useMemo, useRef } from 'react';
import { useServices } from '@/providers/ServiceProvider';
import { createSummarizerApi } from '../api';
import { useSummarizerStore } from '../store/summarizerStore';
import type { SummarizePayload } from '../types';
import { composePrompt } from '../prompt';

export const useSummarizer = () => {
  const { httpClient, logger } = useServices();
  const api = useMemo(() => createSummarizerApi(httpClient, logger), [httpClient, logger]);
  const abortRef = useRef<AbortController | null>(null);

  const {
    summary,
    keywords,
    isLoading,
    error,
    streamingSummary,
    isStreaming,
    startRequest,
    resolveRequest,
    failRequest,
    resetStreaming,
    appendChunk,
    completeStreaming,
  } = useSummarizerStore();

  const cancelOngoing = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  const summarize = useCallback(
    async (payload: SummarizePayload) => {
      const prepared: SummarizePayload = {
        ...payload,
        prompt: composePrompt(payload.prompt),
      };
      cancelOngoing();
      const controller = new AbortController();
      abortRef.current = controller;

      startRequest();

      try {
        const data = await api.summarize(prepared, controller.signal);
        resolveRequest(data);
      } catch (requestError) {
        failRequest((requestError as Error).message);
      }
    },
    [api, cancelOngoing, failRequest, resolveRequest, startRequest],
  );

  const streamSummary = useCallback(
    async (payload: SummarizePayload) => {
      const prepared: SummarizePayload = {
        ...payload,
        prompt: composePrompt(payload.prompt),
      };
      cancelOngoing();
      const controller = new AbortController();
      abortRef.current = controller;

      resetStreaming();

      await api.streamSummary(
        prepared,
        {
          onChunk: (chunk) => {
            if (chunk.partialSummary) {
              appendChunk(chunk.partialSummary);
            }

            if (chunk.completed) {
              completeStreaming({ summary: chunk.partialSummary ?? '', keywords: chunk.keywords ?? [] });
            }
          },
          onError: (streamError) => failRequest(streamError.message),
          onComplete: () => completeStreaming(),
        },
        controller.signal,
      );
    },
    [abortRef, api, appendChunk, cancelOngoing, completeStreaming, failRequest, resetStreaming],
  );

  return {
    summarize,
    streamSummary,
    cancelOngoing,
    summary,
    keywords,
    isLoading,
    error,
    isStreaming,
    streamingSummary,
  };
};
