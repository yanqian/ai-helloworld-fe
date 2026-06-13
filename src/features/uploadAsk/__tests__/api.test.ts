import { askQuestion, fetchSessionLogs, uploadDocument } from '../api';
import type { HttpClient } from '@/services/httpClient';

const jsonResponse = (body: unknown, status = 200) =>
  ({
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
    text: async () => JSON.stringify(body),
  }) as Response;

describe('upload ask api contract', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    delete (globalThis as { fetch?: unknown }).fetch;
  });

  it('uploads multipart form data with Authorization and without forcing JSON content headers', async () => {
    const document = {
      id: 'doc-1',
      userId: 1,
      title: 'Notebook',
      source: 'upload' as const,
      status: 'pending' as const,
      failureReason: undefined,
      createdAt: '2026-06-13T00:00:00Z',
      updatedAt: '2026-06-13T00:00:00Z',
    };
    const fetchMock = jest.fn().mockResolvedValue(jsonResponse({ document }));
    globalThis.fetch = fetchMock as typeof fetch;
    const file = new File(['hello'], 'notes.txt', { type: 'text/plain' });

    await expect(
      uploadDocument({ apiBaseUrl: 'https://api.example.test/', token: 'access-token', file, title: 'Notebook' }),
    ).resolves.toEqual({ document });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('https://api.example.test/api/v1/upload-ask/documents');
    expect(init).toMatchObject({ method: 'POST' });
    expect(init.headers).toEqual({ Authorization: 'Bearer access-token' });
    expect(init.headers).not.toHaveProperty('Content-Type');
    expect(init.body).toBeInstanceOf(FormData);
    expect((init.body as FormData).get('title')).toBe('Notebook');
    expect((init.body as FormData).get('file')).toBe(file);
  });

  it('preserves ask and history response fields used by the UI', async () => {
    const client = {
      post: jest.fn().mockResolvedValue({
        sessionId: 'session-1',
        answer: 'Answer',
        latencyMs: 42,
        usedHistoryTokens: 7,
        sources: [{ documentId: 'doc-1', chunkIndex: 0, score: 0.91, preview: 'Citation preview' }],
      }),
      get: jest.fn().mockResolvedValue({
        logs: [
          {
            id: 'log-1',
            sessionId: 'session-1',
            queryText: 'Question?',
            responseText: 'Answer',
            latencyMs: 42,
            createdAt: '2026-06-13T00:00:00Z',
            sources: [{ documentId: 'doc-1', chunkIndex: 0, score: 0.91, preview: 'Citation preview' }],
          },
        ],
      }),
    } as unknown as HttpClient;

    await expect(
      askQuestion(client, { query: 'Question?', documentIds: ['doc-1'], sessionId: 'session-1', topK: 1 }),
    ).resolves.toMatchObject({
      sessionId: 'session-1',
      answer: 'Answer',
      latencyMs: 42,
      usedHistoryTokens: 7,
      sources: [{ documentId: 'doc-1', chunkIndex: 0, score: 0.91, preview: 'Citation preview' }],
    });
    expect(client.post).toHaveBeenCalledWith('/api/v1/upload-ask/qa/query', {
      query: 'Question?',
      documentIds: ['doc-1'],
      sessionId: 'session-1',
      topK: 1,
    });

    await expect(fetchSessionLogs(client, 'session-1')).resolves.toMatchObject({
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
    expect(client.get).toHaveBeenCalledWith('/api/v1/upload-ask/qa/sessions/session-1/logs');
  });
});
