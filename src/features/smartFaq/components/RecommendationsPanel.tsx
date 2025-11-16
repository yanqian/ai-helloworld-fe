import type { TrendingQuery } from '../types';

interface RecommendationsPanelProps {
  recommendations: TrendingQuery[];
  onSelect?: (query: string) => void;
  onRefresh?: () => void;
}

export const RecommendationsPanel = ({ recommendations, onSelect, onRefresh }: RecommendationsPanelProps) => {
  return (
    <div className="rounded-2xl border border-border bg-white/60 p-5">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-800">Top searches</p>
          <p className="text-xs text-slate-500">Based on the last day of FAQ traffic.</p>
        </div>
        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            className="text-xs font-medium text-primary hover:underline"
          >
            Refresh
          </button>
        )}
      </div>

      {recommendations.length === 0 ? (
        <p className="text-sm text-slate-500">Ask a question to start building recommendations.</p>
      ) : (
        <ul className="space-y-2">
          {recommendations.map((item) => (
            <li key={item.query}>
              <button
                type="button"
                onClick={() => onSelect?.(item.query)}
                className="flex w-full items-center justify-between rounded-xl border border-transparent bg-slate-50 px-3 py-2 text-left text-sm text-slate-800 transition hover:border-primary/40 hover:bg-white"
              >
                <span>{item.query}</span>
                <span className="text-xs font-semibold text-slate-500">{item.count}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
