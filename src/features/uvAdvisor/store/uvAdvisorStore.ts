import { create } from 'zustand';
import type { RequestMetrics } from '@/types/metrics';
import type { UVAdviceResponse, UVAdvisorState } from '../types';

interface Actions {
  startRequest: () => void;
  resolve: (payload: UVAdviceResponse) => void;
  fail: (message: string) => void;
  reset: () => void;
  setMetrics: (metrics?: RequestMetrics) => void;
}

const initialState: UVAdvisorState = {
  advice: undefined,
  isLoading: false,
  error: undefined,
  metrics: undefined,
};

export const useUVAdvisorStore = create<UVAdvisorState & Actions>((set) => ({
  ...initialState,
  startRequest: () =>
    set(() => ({
      isLoading: true,
      error: undefined,
      metrics: undefined,
    })),
  resolve: (payload) =>
    set(() => ({
      advice: payload,
      isLoading: false,
      error: undefined,
    })),
  fail: (message) =>
    set(() => ({
      isLoading: false,
      error: message,
      metrics: undefined,
    })),
  reset: () => set(initialState),
  setMetrics: (metrics) => set({ metrics }),
}));
