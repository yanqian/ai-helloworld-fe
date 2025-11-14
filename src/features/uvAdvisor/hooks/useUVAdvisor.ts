import { useCallback, useMemo, useRef } from 'react';
import { useServices } from '@/providers/ServiceProvider';
import { createUVAdvisorApi } from '../api';
import { useUVAdvisorStore } from '../store/uvAdvisorStore';
import type { UVAdviceRequest } from '../types';

export const useUVAdvisor = () => {
  const { httpClient, logger } = useServices();
  const api = useMemo(() => createUVAdvisorApi(httpClient), [httpClient]);
  const abortRef = useRef<AbortController | null>(null);
  const { advice, isLoading, error, startRequest, resolve, fail } = useUVAdvisorStore();

  const fetchAdvice = useCallback(
    async (payload: UVAdviceRequest) => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      startRequest();
      try {
        const data = await api.fetchAdvice(payload, controller.signal);
        resolve(data);
      } catch (requestError) {
        const message =
          requestError instanceof Error ? requestError.message : 'Unable to fetch UV advice';
        logger.log('error', 'uv advice request failed', { message });
        fail(message);
      }
    },
    [api, fail, logger, resolve, startRequest],
  );

  return {
    fetchAdvice,
    abort: () => abortRef.current?.abort(),
    advice,
    isLoading,
    error,
  };
};
