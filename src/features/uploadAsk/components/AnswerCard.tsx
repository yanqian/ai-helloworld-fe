import { useMemo, useState } from 'react';
import type { ChunkSource } from '../types';

interface AnswerCardProps {
  answer?: string;
  sources?: ChunkSource[];
  latencyMs?: number;
}

const CITATIONS_COLLAPSE_COUNT = 3;
const PREVIEW_COLLAPSE_LENGTH = 160;
const citationRegex = /Doc\s+([0-9a-fA-F-]{36})\s+chunk\s+(\d+)/g;

export const AnswerCard = ({ answer, sources, latencyMs }: AnswerCardProps) => {
  const [showAllCitations, setShowAllCitations] = useState(false);
  const [expandedPreviews, setExpandedPreviews] = useState<Record<string, boolean>>({});

  const citationIndex = useMemo(() => {
    if (!sources) return {};
    return sources.reduce<Record<string, number>>((acc, source, idx) => {
      acc[`${source.documentId}:${source.chunkIndex}`] = idx + 1;
      return acc;
    }, {});
  }, [sources]);

  const renderedAnswer = useMemo(() => {
    if (!answer) return null;
    const parts: (string | JSX.Element)[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = citationRegex.exec(answer)) !== null) {
      const [full, docId, chunkIdxStr] = match;
      const chunkIdx = Number.parseInt(chunkIdxStr, 10);
      const key = `${docId}:${chunkIdx}`;
      const citationNumber = citationIndex[key];

      if (match.index > lastIndex) {
        parts.push(answer.slice(lastIndex, match.index));
      }

      if (citationNumber) {
        parts.push(
          <span key={`${key}-${citationNumber}`} className="inline-flex items-baseline gap-1">
            {full}
            <a
              href={`#citation-${citationNumber}`}
              className="align-super text-[11px] font-semibold text-indigo-600 hover:underline"
            >
              [{citationNumber}]
            </a>
          </span>,
        );
      } else {
        parts.push(full);
      }

      lastIndex = match.index + full.length;
    }

    if (lastIndex < answer.length) {
      parts.push(answer.slice(lastIndex));
    }

    return parts;
  }, [answer, citationIndex]);

  const visibleSources =
    sources && !showAllCitations
      ? sources.slice(0, CITATIONS_COLLAPSE_COUNT)
      : sources ?? [];

  return (
    <div className="space-y-4 rounded-xl border border-border bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-800">Answer</h3>
        {latencyMs !== undefined && (
          <span className="text-xs font-semibold text-slate-500">{latencyMs} ms</span>
        )}
      </div>
      {answer ? (
        <p className="whitespace-pre-line text-sm leading-relaxed text-slate-800">
          {renderedAnswer}
        </p>
      ) : (
        <p className="text-sm text-slate-500">Ask a question to see the answer here.</p>
      )}

      {sources && sources.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Citations
            </p>
            {sources.length > CITATIONS_COLLAPSE_COUNT && (
              <button
                type="button"
                onClick={() => setShowAllCitations((prev) => !prev)}
                className="text-xs font-semibold text-indigo-600 hover:underline"
              >
                {showAllCitations ? 'Show less' : `Show all (${sources.length})`}
              </button>
            )}
          </div>
          <ul className="space-y-2">
            {visibleSources.map((source, idx) => {
              const citationNumber = (sources?.indexOf(source) ?? idx) + 1;
              const previewKey = `${source.documentId}-${source.chunkIndex}`;
              const preview = source.preview ?? '';
              const isLong = preview.length > PREVIEW_COLLAPSE_LENGTH;
              const isExpanded = expandedPreviews[previewKey] ?? false;
              const displayPreview =
                isLong && !isExpanded
                  ? `${preview.slice(0, PREVIEW_COLLAPSE_LENGTH).trimEnd()}...`
                  : preview;

              return (
                <li
                  key={`${source.documentId}-${source.chunkIndex}`}
                  id={`citation-${citationNumber}`}
                  className="rounded-lg border border-border/70 bg-slate-50 p-3 text-xs text-slate-700"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">
                      [{citationNumber}] Doc {source.documentId.slice(0, 6)}
                    </span>
                    <span className="text-slate-500">Score {source.score.toFixed(2)}</span>
                  </div>
                  <p className="mt-1 text-slate-600">
                    {displayPreview}{' '}
                    {isLong && (
                      <button
                        type="button"
                        className="font-semibold text-indigo-600 hover:underline"
                        onClick={() =>
                          setExpandedPreviews((prev) => ({
                            ...prev,
                            [previewKey]: !isExpanded,
                          }))
                        }
                      >
                        {isExpanded ? 'Show less' : 'More'}
                      </button>
                    )}
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};
