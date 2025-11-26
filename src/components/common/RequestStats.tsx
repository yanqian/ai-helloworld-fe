import type { RequestMetrics, TokenUsage } from '@/types/metrics';

interface RequestStatsProps {
  metrics?: RequestMetrics;
  isLoading?: boolean;
  title?: string;
  className?: string;
}

const formatDuration = (value?: number) => {
  if (typeof value !== 'number' || value < 0) {
    return '—';
  }
  if (value < 1000) {
    return `${Math.round(value)} ms`;
  }
  return `${(value / 1000).toFixed(2)} s`;
};

const formatTokens = (usage?: TokenUsage) => {
  if (!usage) {
    return { total: '—', breakdown: '' };
  }

  const parts: string[] = [];
  if (usage.promptTokens) {
    parts.push(`${usage.promptTokens} prompt`);
  }
  if (usage.completionTokens) {
    parts.push(`${usage.completionTokens} completion`);
  }

  return {
    total: `${usage.totalTokens} tokens`,
    breakdown: parts.length ? parts.join(' · ') : '',
  };
};

export const RequestStats = ({ metrics, isLoading, title = 'Request insights', className }: RequestStatsProps) => {
  const tokens = formatTokens(metrics?.tokenUsage);

  return (
    <section
      className={`rounded-lg border border-border/70 bg-white/90 p-4 text-sm text-slate-700 shadow-sm transition ${className ?? ''}`}
    >
      <header className="mb-3 flex items-center justify-between gap-2">
        <p className="font-semibold text-slate-800">{title}</p>
        {isLoading ? <span className="text-xs font-semibold text-primary">Running…</span> : null}
      </header>

      <div className="grid gap-3 sm:grid-cols-2">
        <article className="rounded-md border border-slate-200 bg-slate-50/80 p-3">
          <p className="text-[11px] uppercase tracking-wide text-slate-500">Request time</p>
          <p className="mt-1 font-semibold text-slate-900">
            {isLoading ? 'Measuring…' : formatDuration(metrics?.durationMs)}
          </p>
        </article>

        <article className="rounded-md border border-slate-200 bg-slate-50/80 p-3">
          <p className="text-[11px] uppercase tracking-wide text-slate-500">Tokens used</p>
          <p className="mt-1 font-semibold text-slate-900">
            {isLoading ? 'Pending…' : tokens.total}
          </p>
          {tokens.breakdown ? (
            <p className="text-xs text-slate-500">Breakdown: {tokens.breakdown}</p>
          ) : null}
        </article>
      </div>
    </section>
  );
};
