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
    setMetrics,
    metrics,
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
      const started = performance.now();

      startRequest();

      try {
        const data = await api.summarize(prepared, controller.signal);
        setMetrics({
          durationMs: Math.round(performance.now() - started),
          tokenUsage: data.tokenUsage,
        });
        resolveRequest(data);
      } catch (requestError) {
        failRequest((requestError as Error).message);
      }
    },
    [api, cancelOngoing, failRequest, resolveRequest, setMetrics, startRequest],
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
      setMetrics(undefined);
      const started = performance.now();

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
          onComplete: () => {
            setMetrics({ durationMs: Math.round(performance.now() - started) });
            completeStreaming();
          },
        },
        controller.signal,
      );
    },
    [abortRef, api, appendChunk, cancelOngoing, completeStreaming, failRequest, resetStreaming, setMetrics],
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
    metrics,
  };
};
