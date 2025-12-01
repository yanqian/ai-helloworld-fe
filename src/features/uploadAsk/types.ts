export type DocumentStatus = 'pending' | 'processing' | 'processed' | 'failed';

export interface UploadDocument {
  id: string;
  title: string;
  status: DocumentStatus;
  failureReason?: string;
  createdAt: string;
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
}

export interface QASession {
  id: string;
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
  answer?: string;
  sources?: ChunkSource[];
  latencyMs?: number;
  sessionId?: string;
  currentQuery?: string;
}
