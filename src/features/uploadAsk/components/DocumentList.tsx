import type { UploadDocument } from '../types';

interface DocumentListProps {
  documents: UploadDocument[];
  isLoading?: boolean;
  onRefresh?: () => void;
}

const statusStyles: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-700 ring-amber-200',
  processing: 'bg-sky-50 text-sky-700 ring-sky-200',
  processed: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  failed: 'bg-red-50 text-red-700 ring-red-200',
};

export const DocumentList = ({ documents, isLoading, onRefresh }: DocumentListProps) => (
  <div className="space-y-3 rounded-xl border border-border bg-white p-4 shadow-sm">
    <div className="flex items-center justify-between">
      <h3 className="text-sm font-semibold text-slate-800">Uploads</h3>
      {onRefresh && (
        <button
          type="button"
          onClick={onRefresh}
          className="text-xs font-semibold text-primary transition hover:text-primary/80"
        >
          Refresh
        </button>
      )}
    </div>
    {isLoading ? (
      <div className="space-y-2">
        {[1, 2, 3].map((item) => (
          <div key={item} className="h-10 animate-pulse rounded-md bg-slate-100" />
        ))}
      </div>
    ) : documents.length === 0 ? (
      <p className="text-sm text-slate-500">No uploads yet.</p>
    ) : (
      <ul className="space-y-2">
        {documents.map((doc) => (
          <li key={doc.id} className="rounded-lg border border-border/60 p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-800">{doc.title}</p>
                <p className="text-xs text-slate-500">
                  {new Date(doc.createdAt).toLocaleString()}
                </p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${statusStyles[doc.status] ?? 'bg-slate-100 text-slate-600 ring-slate-200'}`}
              >
                {doc.status}
              </span>
            </div>
            {doc.failureReason && (
              <p className="mt-1 text-xs text-red-600">Error: {doc.failureReason}</p>
            )}
          </li>
        ))}
      </ul>
    )}
  </div>
);
