import type { RequestMetrics, TokenUsage } from '@/types/metrics';

export interface UVAdviceRequest {
  date?: string;
}

export interface UVReading {
  hour: string;
  value: number;
}

export interface UVAdviceResponse {
  date: string;
  category: string;
  maxUv: number;
  peakHour: string;
  source: string;
  summary: string;
  clothing: string[];
  protection: string[];
  tips: string[];
  readings: UVReading[];
  dataTimestamp?: string;
  durationMs?: number;
  tokenUsage?: TokenUsage;
}

export interface UVAdvisorState {
  advice?: UVAdviceResponse;
  isLoading: boolean;
  error?: string;
  metrics?: RequestMetrics;
}
