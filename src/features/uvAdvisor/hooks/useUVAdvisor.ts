import { useCallback, useMemo, useRef } from 'react';
import { useServices } from '@/providers/ServiceProvider';
import { createUVAdvisorApi } from '../api';
import { useUVAdvisorStore } from '../store/uvAdvisorStore';
import type { UVAdviceRequest } from '../types';

export const useUVAdvisor = () => {
  const { httpClient, logger } = useServices();
  const api = useMemo(() => createUVAdvisorApi(httpClient), [httpClient]);
  const abortRef = useRef<AbortController | null>(null);
  const { advice, isLoading, error, metrics, startRequest, resolve, fail, setMetrics } =
    useUVAdvisorStore();

  const fetchAdvice = useCallback(
    async (payload: UVAdviceRequest) => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      const started = performance.now();

      startRequest();
      try {
        const data = await api.fetchAdvice(payload, controller.signal);
        setMetrics({
          durationMs: Math.round(performance.now() - started),
          tokenUsage: data.tokenUsage,
        });
        resolve(data);
      } catch (requestError) {
        const message =
          requestError instanceof Error ? requestError.message : 'Unable to fetch UV advice';
        logger.log('error', 'uv advice request failed', { message });
        fail(message);
      }
    },
    [api, fail, logger, resolve, setMetrics, startRequest],
  );

  return {
    fetchAdvice,
    abort: () => abortRef.current?.abort(),
    advice,
    isLoading,
    error,
    metrics,
  };
};
