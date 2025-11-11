import { act } from '@testing-library/react';
import { useSummarizerStore } from '../summarizerStore';

describe('useSummarizerStore', () => {
  beforeEach(() => {
    useSummarizerStore.setState((state) => ({
      ...state,
      summary: '',
      keywords: [],
      streamingSummary: '',
      isStreaming: false,
    }));
  });

  it('tracks incremental streaming chunks and final summary', () => {
    const store = useSummarizerStore.getState();

    act(() => {
      store.resetStreaming();
      store.appendChunk('hello');
      store.appendChunk('hello world');
      store.appendChunk('hello world!');
      store.completeStreaming({ summary: '', keywords: ['alpha'] });
    });

    const current = useSummarizerStore.getState();
    expect(current.summary).toBe('hello world!');
    expect(current.keywords).toEqual(['alpha']);
    expect(current.isStreaming).toBe(false);
  });
});
