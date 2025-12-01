import type { HttpClient } from '@/services/httpClient';
import type { AskResponse, QueryLog, QASession, UploadDocument } from './types';

const buildUrl = (baseUrl: string, path: string): string => {
  if (!baseUrl) {
    return path;
  }
  return `${baseUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
};

const parseError = async (response: Response): Promise<string> => {
  try {
    const payload = await response.json();
    return payload?.error?.message ?? payload?.message ?? 'Request failed';
  } catch (error) {
    return (error as Error)?.message ?? 'Request failed';
  }
};

export const fetchDocuments = (client: HttpClient) =>
  client.get<{ items: UploadDocument[] }>('/api/v1/upload-ask/documents');

export const fetchSessions = (client: HttpClient) =>
  client.get<{ sessions: QASession[] }>('/api/v1/upload-ask/qa/sessions');

export const fetchSessionLogs = (client: HttpClient, sessionId: string) =>
  client.get<{ logs: QueryLog[] }>(`/api/v1/upload-ask/qa/sessions/${sessionId}/logs`);

export const askQuestion = (
  client: HttpClient,
  payload: { query: string; documentIds?: string[]; sessionId?: string; topK?: number },
) => client.post<AskResponse>('/api/v1/upload-ask/qa/query', payload);

export const uploadDocument = async (options: {
  apiBaseUrl: string;
  token: string;
  file: File;
  title?: string;
}): Promise<{ document: UploadDocument }> => {
  const url = buildUrl(options.apiBaseUrl, '/api/v1/upload-ask/documents');
  const formData = new FormData();
  formData.append('file', options.file);
  if (options.title) {
    formData.append('title', options.title);
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${options.token}` },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }
  return response.json();
};
