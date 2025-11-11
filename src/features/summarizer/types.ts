export interface SummarizePayload {
  text: string;
  prompt?: string;
}

export interface SummaryResponse {
  summary: string;
  keywords: string[];
}

export interface StreamChunk {
  partialSummary: string;
  completed?: boolean;
  keywords?: string[];
}

export interface SummarizerState {
  summary: string;
  keywords: string[];
  isLoading: boolean;
  error?: string;
  isStreaming: boolean;
  streamingSummary: string;
}
