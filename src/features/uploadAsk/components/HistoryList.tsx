import { useState } from 'react';

import type { QueryLog } from '../types';

interface HistoryListProps {
  logs: QueryLog[];
}

const PREVIEW_LEN = 180;

export const HistoryList = ({ logs }: HistoryListProps) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggle = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const renderResponse = (log: QueryLog) => {
    const full = log.responseText ?? '';
    const isExpanded = expanded[log.id];
    const shouldClip = full.length > PREVIEW_LEN;
    if (!shouldClip || isExpanded) {
      return (
        <>
          <p className="mt-1 text-xs text-slate-600">{full}</p>
          {shouldClip && (
            <button
              type="button"
              className="mt-1 text-xs font-semibold text-primary hover:underline"
              onClick={() => toggle(log.id)}
            >
              Show less
            </button>
          )}
        </>
      );
    }
    const preview = `${full.slice(0, PREVIEW_LEN).trimEnd()}…`;
    return (
      <>
        <p className="mt-1 text-xs text-slate-600">{preview}</p>
        <button
          type="button"
          className="mt-1 text-xs font-semibold text-primary hover:underline"
          onClick={() => toggle(log.id)}
        >
          Show more
        </button>
      </>
    );
  };

  return (
    <div className="space-y-2 rounded-xl border border-border bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-800">Recent questions</h3>
        <span className="text-xs text-slate-500">{logs.length} entries</span>
      </div>
      {logs.length === 0 ? (
        <p className="text-sm text-slate-500">No history yet.</p>
      ) : (
        <ul className="space-y-2">
          {logs.slice(-5).reverse().map((log) => (
            <li key={log.id} className="rounded-lg border border-border/70 bg-slate-50 p-3">
              <p className="text-sm font-semibold text-slate-800">{log.queryText}</p>
              {renderResponse(log)}
              <p className="mt-1 text-xs text-slate-500">
                {new Date(log.createdAt).toLocaleString()} • {log.latencyMs ?? 0} ms
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
