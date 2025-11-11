import { SummarizerForm } from './components/SummarizerForm';
import { SummaryResult } from './components/SummaryResult';
import { useSummarizer } from './hooks/useSummarizer';

export const SummarizerPage = () => {
  const {
    summarize,
    streamSummary,
    summary,
    keywords,
    isLoading,
    error,
    isStreaming,
    streamingSummary,
  } = useSummarizer();

  return (
    <div className="grid w-full gap-6 md:grid-cols-2">
      <div className="space-y-4">
        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <SummarizerForm
          onSubmit={summarize}
          onStream={streamSummary}
          isLoading={isLoading}
          isStreaming={isStreaming}
        />

      </div>

      <SummaryResult
        summary={summary}
        keywords={keywords}
        streamingSummary={streamingSummary}
        isStreaming={isStreaming}
      />
    </div>
  );
};
