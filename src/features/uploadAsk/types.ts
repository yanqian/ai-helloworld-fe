export type DocumentStatus = 'pending' | 'processing' | 'processed' | 'failed';

export interface UploadDocument {
  id: string;
  userId?: number;
  title: string;
  source?: 'upload' | 'url';
  status: DocumentStatus;
  failureReason?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ChunkSource {
  documentId: string;
  chunkIndex: number;
  score: number;
  preview: string;
}

export interface AskResponse {
  sessionId: string;
  answer: string;
  sources: ChunkSource[];
  latencyMs?: number;
  usedHistoryTokens?: number;
}

export interface QASession {
  id: string;
  userId?: number;
  createdAt: string;
}

export interface QueryLog {
  id: string;
  sessionId: string;
  queryText: string;
  responseText: string;
  latencyMs?: number;
  createdAt: string;
  sources?: ChunkSource[];
}

export interface UploadAskState {
  documents: UploadDocument[];
  sessions: QASession[];
  logs: QueryLog[];
  isLoadingDocs: boolean;
  isUploading: boolean;
  isAsking: boolean;
  error?: string;
  askError?: string;
  historyError?: string;
  answer?: string;
  sources?: ChunkSource[];
  latencyMs?: number;
  usedHistoryTokens?: number;
  sessionId?: string;
  currentQuery?: string;
}
