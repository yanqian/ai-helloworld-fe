import { act, renderHook, waitFor } from '@testing-library/react';
import { useAuth } from '@/providers/AuthProvider';
import { useServices } from '@/providers/ServiceProvider';
import { askQuestion, fetchDocuments, fetchSessionLogs, fetchSessions } from '../api';
import { useUploadAsk } from '../hooks/useUploadAsk';
import { useUploadAskStore } from '../store';

jest.mock('@/providers/AuthProvider', () => ({
  useAuth: jest.fn(),
}));

jest.mock('@/providers/ServiceProvider', () => ({
  useServices: jest.fn(),
}));

jest.mock('../api', () => ({
  askQuestion: jest.fn(),
  fetchDocuments: jest.fn(),
  fetchSessions: jest.fn(),
  fetchSessionLogs: jest.fn(),
  uploadDocument: jest.fn(),
}));

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

describe('useUploadAsk ask flow', () => {
  beforeEach(() => {
    resetStore();
    jest.mocked(useAuth).mockReturnValue({
      token: 'access-token',
      refreshToken: 'refresh-token',
      email: 'user@example.test',
      nickname: 'User',
      isAuthenticated: true,
      login: jest.fn(),
      logout: jest.fn(),
      refreshSession: jest.fn(),
    });
    jest.mocked(useServices).mockReturnValue({
      httpClient: {} as ReturnType<typeof useServices>['httpClient'],
      logger: {} as ReturnType<typeof useServices>['logger'],
      apiBaseUrl: 'https://api.example.test',
    });
    jest.mocked(fetchDocuments).mockResolvedValue({ items: [] });
    jest
      .mocked(fetchSessions)
      .mockResolvedValueOnce({ sessions: [] })
      .mockResolvedValueOnce({
        sessions: [{ id: 'session-new', createdAt: '2026-06-15T00:00:00Z' }],
      });
    jest.mocked(fetchSessionLogs).mockResolvedValue({
      logs: [
        {
          id: 'log-1',
          sessionId: 'session-new',
          queryText: 'What changed?',
          responseText: 'Fresh answer',
          latencyMs: 33,
          createdAt: '2026-06-15T00:00:01Z',
          sources: [{ documentId: 'doc-1', chunkIndex: 0, score: 0.98, preview: 'Citation' }],
        },
      ],
    });
    jest.mocked(askQuestion).mockResolvedValue({
      sessionId: 'session-new',
      answer: 'Fresh answer',
      latencyMs: 33,
      usedHistoryTokens: 5,
      sources: [{ documentId: 'doc-1', chunkIndex: 0, score: 0.98, preview: 'Citation' }],
    });
  });

  it('preserves the current answer after refreshing sessions and history', async () => {
    const { result } = renderHook(() => useUploadAsk());

    await waitFor(() => expect(fetchSessions).toHaveBeenCalledTimes(1));

    await act(async () => {
      await result.current.askQuestion('What changed?', ['doc-1']);
    });

    expect(askQuestion).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ query: 'What changed?', documentIds: ['doc-1'] }),
    );
    expect(fetchSessions).toHaveBeenCalledTimes(2);
    expect(fetchSessionLogs).toHaveBeenCalledWith(expect.anything(), 'session-new');
    expect(result.current).toMatchObject({
      answer: 'Fresh answer',
      latencyMs: 33,
      sessionId: 'session-new',
      sources: [{ documentId: 'doc-1', chunkIndex: 0, score: 0.98, preview: 'Citation' }],
      logs: [
        {
          sessionId: 'session-new',
          queryText: 'What changed?',
          responseText: 'Fresh answer',
          latencyMs: 33,
        },
      ],
    });
    expect(useUploadAskStore.getState().usedHistoryTokens).toBe(5);
  });
});
