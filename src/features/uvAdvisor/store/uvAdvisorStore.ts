import { create } from 'zustand';
import type { UVAdviceResponse, UVAdvisorState } from '../types';

interface Actions {
  startRequest: () => void;
  resolve: (payload: UVAdviceResponse) => void;
  fail: (message: string) => void;
  reset: () => void;
}

const initialState: UVAdvisorState = {
  advice: undefined,
  isLoading: false,
  error: undefined,
};

export const useUVAdvisorStore = create<UVAdvisorState & Actions>((set) => ({
  ...initialState,
  startRequest: () =>
    set(() => ({
      isLoading: true,
      error: undefined,
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
    })),
  reset: () => set(initialState),
}));
