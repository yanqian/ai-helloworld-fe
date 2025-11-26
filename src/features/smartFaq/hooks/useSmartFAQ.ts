import { useCallback, useMemo, useRef } from 'react';
import { useServices } from '@/providers/ServiceProvider';
import { createSmartFAQApi } from '../api';
import { useSmartFAQStore } from '../store/smartFaqStore';
import type { SmartFAQRequest } from '../types';

export const useSmartFAQ = () => {
  const { httpClient, logger } = useServices();
  const api = useMemo(() => createSmartFAQApi(httpClient), [httpClient]);
  const abortRef = useRef<AbortController | null>(null);

  const {
    result,
    isLoading,
    error,
    recommendations,
    metrics,
    startRequest,
    resolve,
    fail,
    setRecommendations,
    setMetrics,
  } = useSmartFAQStore();

  const cancelOngoing = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  const search = useCallback(
    async (payload: SmartFAQRequest) => {
      cancelOngoing();
      const controller = new AbortController();
      abortRef.current = controller;
      const started = performance.now();

      startRequest();
      try {
        const response = await api.search(payload, controller.signal);
        setMetrics({
          durationMs: Math.round(performance.now() - started),
          tokenUsage: response.tokenUsage,
        });
        resolve(response);
      } catch (requestError) {
        fail((requestError as Error).message);
      }
    },
    [api, cancelOngoing, fail, resolve, setMetrics, startRequest],
  );

  const loadRecommendations = useCallback(async () => {
    try {
      const data = await api.fetchTrending();
      setRecommendations(data.recommendations ?? []);
    } catch (recommendationError) {
      logger.log('warn', 'Failed to load FAQ recommendations', {
        errorMessage: recommendationError instanceof Error ? recommendationError.message : 'unknown error',
      });
    }
  }, [api, logger, setRecommendations]);

  return {
    search,
    cancelOngoing,
    loadRecommendations,
    result,
    isLoading,
    error,
    recommendations,
    metrics,
  };
};
