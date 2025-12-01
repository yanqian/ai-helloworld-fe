import { useState, type FormEvent } from 'react';
import clsx from 'clsx';
import type { UploadDocument } from '../types';

interface AskPanelProps {
  onAsk: (query: string, documentIds: string[]) => Promise<void> | void;
  documents: UploadDocument[];
  isAsking?: boolean;
  error?: string;
}

export const AskPanel = ({ onAsk, documents, isAsking, error }: AskPanelProps) => {
  const [query, setQuery] = useState('');
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);

  const toggleDoc = (id: string) => {
    setSelectedDocs((prev) =>
      prev.includes(id) ? prev.filter((docId) => docId !== id) : [...prev, id],
    );
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!query.trim()) return;
    await onAsk(query, selectedDocs);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-xl border border-border bg-white p-4 shadow-sm">
      <div className="space-y-1">
        <label htmlFor="ask-query" className="text-sm font-semibold text-slate-800">
          Ask a question
        </label>
        <textarea
          id="ask-query"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="What does the contract say about termination? Summarize the meeting notes..."
          rows={4}
          className="w-full rounded-lg border border-border px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Limit to documents (optional)
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          {documents.slice(0, 6).map((doc) => (
            <label
              key={doc.id}
              className={clsx(
                'flex cursor-pointer items-center justify-between rounded-lg border px-3 py-2 text-xs',
                selectedDocs.includes(doc.id) ? 'border-primary bg-primary/5' : 'border-border',
              )}
            >
              <span className="text-slate-700">{doc.title}</span>
              <input
                type="checkbox"
                checked={selectedDocs.includes(doc.id)}
                onChange={() => toggleDoc(doc.id)}
                className="h-4 w-4 accent-primary"
                aria-label={`Include ${doc.title}`}
              />
            </label>
          ))}
          {documents.length === 0 && <p className="text-xs text-slate-500">No processed docs yet.</p>}
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={!query.trim() || isAsking}
        className={clsx(
          'flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition',
          isAsking || !query.trim()
            ? 'cursor-not-allowed bg-slate-200 text-slate-500'
            : 'bg-slate-900 text-white shadow-sm hover:bg-slate-800',
        )}
      >
        {isAsking ? 'Thinking...' : 'Send question'}
      </button>
    </form>
  );
};
