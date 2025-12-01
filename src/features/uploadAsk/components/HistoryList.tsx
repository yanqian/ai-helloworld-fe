import type { QueryLog } from '../types';

interface HistoryListProps {
  logs: QueryLog[];
}

export const HistoryList = ({ logs }: HistoryListProps) => (
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
            <p className="mt-1 text-xs text-slate-600">{log.responseText}</p>
            <p className="mt-1 text-xs text-slate-500">
              {new Date(log.createdAt).toLocaleString()} • {log.latencyMs ?? 0} ms
            </p>
          </li>
        ))}
      </ul>
    )}
  </div>
);
