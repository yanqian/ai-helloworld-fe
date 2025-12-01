import type { ChunkSource } from '../types';

interface AnswerCardProps {
  answer?: string;
  sources?: ChunkSource[];
  latencyMs?: number;
}

export const AnswerCard = ({ answer, sources, latencyMs }: AnswerCardProps) => (
  <div className="space-y-3 rounded-xl border border-border bg-white p-4 shadow-sm">
    <div className="flex items-center justify-between">
      <h3 className="text-sm font-semibold text-slate-800">Answer</h3>
      {latencyMs !== undefined && (
        <span className="text-xs font-semibold text-slate-500">{latencyMs} ms</span>
      )}
    </div>
    {answer ? (
      <p className="whitespace-pre-line text-sm leading-relaxed text-slate-800">{answer}</p>
    ) : (
      <p className="text-sm text-slate-500">Ask a question to see the answer here.</p>
    )}

    {sources && sources.length > 0 && (
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Citations</p>
        <ul className="space-y-2">
          {sources.map((source) => (
            <li
              key={`${source.documentId}-${source.chunkIndex}`}
              className="rounded-lg border border-border/70 bg-slate-50 p-3 text-xs text-slate-700"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold">Doc {source.documentId.slice(0, 6)}</span>
                <span className="text-slate-500">Score {source.score.toFixed(2)}</span>
              </div>
              <p className="mt-1 text-slate-600">{source.preview}</p>
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
);
