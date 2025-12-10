import { useState } from 'react';

import type { QASession, QueryLog } from '../types';

interface HistoryListProps {
  logs: QueryLog[];
  sessions?: QASession[];
  selectedSessionId?: string;
  error?: string;
  onSelectSession?: (id?: string) => void;
}

const PREVIEW_LEN = 180;

export const HistoryList = ({
  logs,
  sessions = [],
  selectedSessionId,
  error,
  onSelectSession,
}: HistoryListProps) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggle = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const sortedSessions = [...sessions].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

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

  const sessionLabel = (session: QASession) =>
    `Session ${session.id.slice(0, 8)} • ${new Date(session.createdAt).toLocaleString()}`;

  return (
    <div className="space-y-2 rounded-xl border border-border bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-slate-800">Session history</h3>
          <p className="text-xs text-slate-600">
            {sessions.length} sessions • {logs.length} entries
            {error ? ` • ${error}` : ''}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            className="rounded-md border border-border bg-white px-2 py-1 text-xs text-slate-700 shadow-sm"
            value={selectedSessionId ?? ''}
            onChange={(e) => onSelectSession?.(e.target.value || undefined)}
          >
            <option value="">Select a session</option>
            {sortedSessions.map((s) => (
              <option key={s.id} value={s.id}>
                {sessionLabel(s)}
              </option>
            ))}
          </select>
        </div>
      </div>
      <p className="text-xs text-slate-500">
        Leave unselected to start a new session; choose an existing one to append new questions.
      </p>
      {logs.length === 0 ? (
        <p className="text-sm text-slate-500">No history yet. Select a session or start a new one.</p>
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
