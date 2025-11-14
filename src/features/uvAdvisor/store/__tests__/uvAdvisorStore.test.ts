import { act } from '@testing-library/react';
import { useUVAdvisorStore } from '../uvAdvisorStore';

describe('useUVAdvisorStore', () => {
  beforeEach(() => {
    useUVAdvisorStore.setState({ advice: undefined, isLoading: false, error: undefined });
  });

  it('stores successful responses', () => {
    const store = useUVAdvisorStore.getState();

    act(() => {
      store.startRequest();
      store.resolve({
        date: '2024-07-01',
        category: 'high',
        maxUv: 8,
        peakHour: '2024-07-01T12:00:00+08:00',
        source: 'https://example.com',
        summary: 'Test summary',
        clothing: ['Hat'],
        protection: ['SPF 50'],
        tips: ['Drink water'],
        readings: [],
      });
    });

    const current = useUVAdvisorStore.getState();
    expect(current.isLoading).toBe(false);
    expect(current.advice?.summary).toBe('Test summary');
  });
});
