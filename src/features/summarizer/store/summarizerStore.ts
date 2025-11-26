import { create } from 'zustand';
import type { RequestMetrics } from '@/types/metrics';
import type { SummarizerState, SummaryResponse } from '../types';

const initialState: SummarizerState = {
  isLoading: false,
  summary: '',
  keywords: [],
  streamingSummary: '',
  isStreaming: false,
  metrics: undefined,
};

interface SummarizerActions {
  startRequest: () => void;
  resolveRequest: (payload: SummaryResponse) => void;
  failRequest: (message: string) => void;
  resetStreaming: () => void;
  appendChunk: (chunk: string) => void;
  completeStreaming: (payload?: SummaryResponse) => void;
  setMetrics: (metrics?: RequestMetrics) => void;
}

export const useSummarizerStore = create<SummarizerState & SummarizerActions>((set) => ({
  ...initialState,
  startRequest: () =>
    set({
      isLoading: true,
      error: undefined,
      metrics: undefined,
    }),
  resolveRequest: ({ summary, keywords }) =>
    set({ isLoading: false, summary, keywords, error: undefined }),
  failRequest: (message) => set({ isLoading: false, error: message, isStreaming: false, metrics: undefined }),
  resetStreaming: () =>
    set({
      streamingSummary: '',
      isStreaming: true,
      error: undefined,
      metrics: undefined,
    }),
  appendChunk: (chunk) =>
    set((state) => {
      if (!chunk) {
        return state;
      }

      return {
        streamingSummary: chunk,
        isStreaming: true,
      };
    }),
  completeStreaming: (payload) =>
    set((state) => {
      return {
        isStreaming: false,
        summary: state.streamingSummary || payload?.summary || state.summary,
        keywords: payload?.keywords ?? state.keywords,
      };
    }),
  setMetrics: (metrics) => set({ metrics }),
}));
