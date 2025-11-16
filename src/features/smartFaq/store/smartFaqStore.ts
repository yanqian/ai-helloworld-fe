import { create } from 'zustand';
import type { SmartFAQResponse, SmartFAQState, TrendingQuery } from '../types';

interface Actions {
  startRequest: () => void;
  resolve: (payload: SmartFAQResponse) => void;
  fail: (message: string) => void;
  setRecommendations: (items: TrendingQuery[]) => void;
}

const initialState: SmartFAQState = {
  isLoading: false,
  recommendations: [],
};

export const useSmartFAQStore = create<SmartFAQState & Actions>((set) => ({
  ...initialState,
  startRequest: () =>
    set((state) => ({
      ...state,
      isLoading: true,
      error: undefined,
    })),
  resolve: (payload) =>
    set((state) => ({
      ...state,
      result: payload,
      recommendations: payload.recommendations ?? state.recommendations,
      isLoading: false,
      error: undefined,
    })),
  fail: (message) =>
    set((state) => ({
      ...state,
      isLoading: false,
      error: message,
    })),
  setRecommendations: (items) =>
    set((state) => ({
      ...state,
      recommendations: items ?? state.recommendations,
    })),
}));
