import type { RequestMetrics, TokenUsage } from '@/types/metrics';

export type SearchMode = 'exact' | 'semantic_hash' | 'similarity' | 'hybrid';

export interface SmartFAQRequest {
  question: string;
  mode: SearchMode;
}

export interface TrendingQuery {
  query: string;
  count: number;
}

export interface SmartFAQResponse {
  question: string;
  answer: string;
  source: string;
  matchedQuestion: string;
  mode: SearchMode;
  recommendations: TrendingQuery[];
  durationMs?: number;
  tokenUsage?: TokenUsage;
}

export interface TrendingResponse {
  recommendations: TrendingQuery[];
}

export interface SmartFAQState {
  result?: SmartFAQResponse;
  isLoading: boolean;
  error?: string;
  recommendations: TrendingQuery[];
  metrics?: RequestMetrics;
}
