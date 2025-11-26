import { RequestStats } from '@/components/common/RequestStats';
import type { RequestMetrics } from '@/types/metrics';
import type { SmartFAQResponse } from '../types';

interface SmartFAQResultProps {
  result?: SmartFAQResponse;
  isLoading: boolean;
  metrics?: RequestMetrics;
}

const SOURCE_LABEL: Record<string, string> = {
  cache: 'Cached answer',
  llm: 'Generated live',
};

export const SmartFAQResult = ({ result, isLoading, metrics }: SmartFAQResultProps) => {
  if (!result) {
    return (
      <div className="space-y-5 rounded-2xl border border-border bg-white p-6 shadow-sm">
        <header className="space-y-1">
          <p className="text-xs uppercase tracking-wide text-slate-500">Smart FAQ</p>
          <h2 className="text-lg font-semibold text-slate-900">Matched question & Answer</h2>
          <p className="text-sm text-slate-600">
            Ask a question to see the matched entry and its answer appear here.
          </p>
        </header>

        <article className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">Matched question</p>
          <p className="mt-2 text-sm text-slate-500 italic">No question selected yet.</p>
        </article>

        <article className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">Answer</p>
          <p className="mt-2 text-sm text-slate-600">Submit a query to view the response.</p>
        </article>

        <RequestStats
          metrics={metrics}
          isLoading={isLoading}
          title="Last run"
          className="border-dashed bg-slate-50/70"
        />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col rounded-2xl border border-border bg-white/90 p-6 shadow-sm">
      <div className="mb-3 flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500">
        <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">Mode: {result.mode}</span>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
          {SOURCE_LABEL[result.source] ?? result.source}
        </span>
      </div>

      <p className="text-sm uppercase tracking-wide text-slate-500">Matched question</p>
      <p className="mb-4 text-lg font-semibold text-slate-900">{result.matchedQuestion}</p>

      <p className="text-sm uppercase tracking-wide text-slate-500">Answer</p>
      <p className="flex-1 whitespace-pre-line text-base leading-relaxed text-slate-800">
        {isLoading ? 'Refining answer…' : result.answer}
      </p>

      <p className="mt-6 text-xs text-slate-400">Original question: {result.question}</p>

      <div className="mt-4">
        <RequestStats metrics={metrics} isLoading={isLoading} title="Last run" />
      </div>
    </div>
  );
};
