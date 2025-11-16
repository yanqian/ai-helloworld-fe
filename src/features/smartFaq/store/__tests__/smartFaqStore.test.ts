import { act } from '@testing-library/react';
import { useSmartFAQStore } from '../smartFaqStore';

const resetStore = () => {
  useSmartFAQStore.setState({
    result: undefined,
    isLoading: false,
    error: undefined,
    recommendations: [],
  });
};

describe('useSmartFAQStore', () => {
  beforeEach(() => {
    resetStore();
  });

  it('stores results and recommendations on resolve', () => {
    const payload = {
      question: 'How far is the moon?',
      answer: '384,400 km on average.',
      matchedQuestion: 'How far is the moon?',
      source: 'cache',
      mode: 'exact' as const,
      recommendations: [{ query: 'How far is the moon?', count: 3 }],
    };

    act(() => {
      useSmartFAQStore.getState().startRequest();
      useSmartFAQStore.getState().resolve(payload);
    });

    const snapshot = useSmartFAQStore.getState();
    expect(snapshot.result?.answer).toBe(payload.answer);
    expect(snapshot.recommendations).toEqual(payload.recommendations);
    expect(snapshot.isLoading).toBe(false);
  });

  it('captures request failures', () => {
    act(() => {
      useSmartFAQStore.getState().startRequest();
      useSmartFAQStore.getState().fail('network error');
    });

    const snapshot = useSmartFAQStore.getState();
    expect(snapshot.error).toBe('network error');
    expect(snapshot.isLoading).toBe(false);
  });
});
