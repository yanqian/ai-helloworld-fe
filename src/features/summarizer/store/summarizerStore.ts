import { create } from 'zustand';
import type { SummarizerState, SummaryResponse } from '../types';

const initialState: SummarizerState = {
  isLoading: false,
  summary: '',
  keywords: [],
  streamingSummary: '',
  isStreaming: false,
};

interface SummarizerActions {
  startRequest: () => void;
  resolveRequest: (payload: SummaryResponse) => void;
  failRequest: (message: string) => void;
  resetStreaming: () => void;
  appendChunk: (chunk: string) => void;
  completeStreaming: (payload?: SummaryResponse) => void;
}

export const useSummarizerStore = create<SummarizerState & SummarizerActions>((set) => ({
  ...initialState,
  startRequest: () => set({ isLoading: true, error: undefined }),
  resolveRequest: ({ summary, keywords }) =>
    set({ isLoading: false, summary, keywords, error: undefined }),
  failRequest: (message) => set({ isLoading: false, error: message, isStreaming: false }),
  resetStreaming: () =>
    set({
      streamingSummary: '',
      isStreaming: true,
      error: undefined,
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
}));
