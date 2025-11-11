interface SummaryResultProps {
  summary: string;
  keywords: string[];
  streamingSummary: string;
  isStreaming: boolean;
}

export const SummaryResult = ({ summary, keywords, streamingSummary, isStreaming }: SummaryResultProps) => (
  <section className="space-y-4 rounded-xl border border-border bg-white p-5 shadow-sm">
    <header>
      <p className="text-xs uppercase tracking-wide text-slate-500">Results</p>
      <h2 className="text-lg font-semibold text-slate-900">Summary & Keywords</h2>
    </header>

    <div className="space-y-6">
      <article>
        <p className="text-sm font-semibold text-slate-600">Summary</p>
        <p className="mt-2 whitespace-pre-line rounded-md bg-slate-50 p-3 text-slate-800">
          {isStreaming && streamingSummary ? streamingSummary : summary || 'Run a summary to see results.'}
        </p>
      </article>

      <article>
        <p className="text-sm font-semibold text-slate-600">Keywords</p>
        {keywords.length > 0 ? (
          <ul className="mt-2 flex flex-wrap gap-2">
            {keywords.map((keyword) => (
              <li key={keyword} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                {keyword}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-slate-500">No keywords yet.</p>
        )}
      </article>
    </div>
  </section>
);
