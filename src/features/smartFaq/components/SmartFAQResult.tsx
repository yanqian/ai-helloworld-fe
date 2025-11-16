import type { SmartFAQResponse } from '../types';

interface SmartFAQResultProps {
  result?: SmartFAQResponse;
  isLoading: boolean;
}

const SOURCE_LABEL: Record<string, string> = {
  cache: 'Cached answer',
  llm: 'Generated live',
};

export const SmartFAQResult = ({ result, isLoading }: SmartFAQResultProps) => {
  if (!result) {
    return (
      <div className="rounded-2xl border border-dashed border-border/70 bg-gradient-to-br from-slate-50 to-white p-8 text-center text-sm text-slate-500">
        Ask a question to see the answer and how it was found.
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
    </div>
  );
};
