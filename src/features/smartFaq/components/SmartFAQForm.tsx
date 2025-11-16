import type { FormEvent } from 'react';
import type { SearchMode, SmartFAQRequest } from '../types';

const MODES: Array<{ value: SearchMode; label: string; description: string }> = [
  {
    value: 'hybrid',
    label: 'Hybrid search',
    description: 'Exact text match first, then pgvector similarity fallback.',
  },
  {
    value: 'exact',
    label: 'Exact match',
    description: 'Literal text equality with no semantic logic.',
  },
  {
    value: 'semantic_hash',
    label: 'Semantic hash',
    description: 'SimHash/LSH bucket lookup backed by pgvector search.',
  },
  {
    value: 'similarity',
    label: 'Similarity',
    description: 'pgvector nearest-neighbor search on embeddings.',
  },
];

interface SmartFAQFormProps {
  question: string;
  mode: SearchMode;
  isLoading: boolean;
  onQuestionChange: (value: string) => void;
  onModeChange: (mode: SearchMode) => void;
  onSubmit: (payload: SmartFAQRequest) => void;
}

export const SmartFAQForm = ({
  question,
  mode,
  isLoading,
  onQuestionChange,
  onModeChange,
  onSubmit,
}: SmartFAQFormProps) => {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit({ question, mode });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-border bg-white/80 p-6 shadow-sm">
      <div className="space-y-2">
        <label htmlFor="faq-question" className="text-sm font-medium text-slate-600">
          Ask anything
        </label>
        <textarea
          id="faq-question"
          className="h-32 w-full rounded-xl border border-border bg-white/90 p-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          placeholder="e.g. How far is the moon from Earth?"
          value={question}
          onChange={(event) => onQuestionChange(event.target.value)}
          disabled={isLoading}
        />
      </div>

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium text-slate-600">Search strategy</legend>
        <div className="grid gap-3 md:grid-cols-2">
          {MODES.map((option) => {
            const isActive = option.value === mode;
            return (
              <button
                key={option.value}
                type="button"
                className={`rounded-xl border p-3 text-left transition ${
                  isActive ? 'border-primary bg-primary/5 shadow-inner' : 'border-border hover:border-primary/50'
                }`}
                onClick={() => onModeChange(option.value)}
                disabled={isLoading}
              >
                <p className="text-sm font-semibold text-slate-800">{option.label}</p>
                <p className="text-xs text-slate-500">{option.description}</p>
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="flex items-center justify-end">
        <button
          type="submit"
          className="rounded-full bg-primary px-6 py-2 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isLoading || !question.trim()}
        >
          {isLoading ? 'Searching…' : 'Get answer'}
        </button>
      </div>
    </form>
  );
};
