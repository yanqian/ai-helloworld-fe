export interface TokenUsage {
  promptTokens: number;
  completionTokens?: number;
  totalTokens: number;
}

export interface RequestMetrics {
  durationMs?: number;
  tokenUsage?: TokenUsage;
}
