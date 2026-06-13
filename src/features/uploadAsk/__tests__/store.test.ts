import { useUploadAskStore } from '../store';

const resetStore = () => {
  useUploadAskStore.setState({
    documents: [],
    sessions: [],
    logs: [],
    isLoadingDocs: false,
    isUploading: false,
    isAsking: false,
    error: undefined,
    askError: undefined,
    historyError: undefined,
    answer: undefined,
    sources: undefined,
    latencyMs: undefined,
    usedHistoryTokens: undefined,
    sessionId: undefined,
    currentQuery: undefined,
  });
};

describe('upload ask store contract', () => {
  beforeEach(() => {
    resetStore();
  });

  it('keeps backend document status and failure reason fields', () => {
    useUploadAskStore.getState().setDocuments([
      {
        id: 'doc-1',
        userId: 1,
        title: 'Failed upload',
        source: 'upload',
        status: 'failed',
        failureReason: 'no content to process',
        createdAt: '2026-06-13T00:00:00Z',
        updatedAt: '2026-06-13T00:00:01Z',
      },
    ]);

    expect(useUploadAskStore.getState().documents[0]).toMatchObject({
      id: 'doc-1',
      userId: 1,
      source: 'upload',
      status: 'failed',
      failureReason: 'no content to process',
      updatedAt: '2026-06-13T00:00:01Z',
    });
  });

  it('resolves answers with session, latency, history tokens, log, and citation fields', () => {
    useUploadAskStore.setState({ currentQuery: 'Question?' });

    useUploadAskStore.getState().resolveAsk({
      sessionId: 'session-1',
      answer: 'Answer',
      latencyMs: 42,
      usedHistoryTokens: 7,
      sources: [{ documentId: 'doc-1', chunkIndex: 0, score: 0.91, preview: 'Citation preview' }],
    });

    expect(useUploadAskStore.getState()).toMatchObject({
      answer: 'Answer',
      latencyMs: 42,
      usedHistoryTokens: 7,
      sessionId: 'session-1',
      sources: [{ documentId: 'doc-1', chunkIndex: 0, score: 0.91, preview: 'Citation preview' }],
      logs: [
        {
          sessionId: 'session-1',
          queryText: 'Question?',
          responseText: 'Answer',
          latencyMs: 42,
          sources: [{ documentId: 'doc-1', chunkIndex: 0, score: 0.91, preview: 'Citation preview' }],
        },
      ],
    });
  });

  it('surfaces ask and history errors without corrupting existing answer or logs', () => {
    useUploadAskStore.setState({
      answer: 'Existing answer',
      sources: [{ documentId: 'doc-1', chunkIndex: 0, score: 0.91, preview: 'Citation preview' }],
      latencyMs: 42,
      logs: [
        {
          id: 'log-1',
          sessionId: 'session-1',
          queryText: 'Question?',
          responseText: 'Existing answer',
          latencyMs: 42,
          createdAt: '2026-06-13T00:00:00Z',
          sources: [{ documentId: 'doc-1', chunkIndex: 0, score: 0.91, preview: 'Citation preview' }],
        },
      ],
    });

    useUploadAskStore.getState().failAsk('Ask failed');
    useUploadAskStore.getState().setHistoryError('History failed');

    expect(useUploadAskStore.getState()).toMatchObject({
      answer: 'Existing answer',
      askError: 'Ask failed',
      historyError: 'History failed',
      latencyMs: 42,
      sources: [{ documentId: 'doc-1', chunkIndex: 0, score: 0.91, preview: 'Citation preview' }],
      logs: [
        {
          id: 'log-1',
          sessionId: 'session-1',
          responseText: 'Existing answer',
          sources: [{ documentId: 'doc-1', chunkIndex: 0, score: 0.91, preview: 'Citation preview' }],
        },
      ],
    });
  });
});
