import { useEffect, useState } from 'react';
import { SmartFAQForm } from './components/SmartFAQForm';
import { RecommendationsPanel } from './components/RecommendationsPanel';
import { SmartFAQResult } from './components/SmartFAQResult';
import { useSmartFAQ } from './hooks/useSmartFAQ';
import type { SearchMode, SmartFAQRequest } from './types';

export const SmartFAQPage = () => {
  const [question, setQuestion] = useState('');
  const [mode, setMode] = useState<SearchMode>('hybrid');
  const { search, loadRecommendations, result, isLoading, error, recommendations, metrics } = useSmartFAQ();

  useEffect(() => {
    void loadRecommendations();
  }, [loadRecommendations]);

  const handleSubmit = (payload: SmartFAQRequest) => {
    if (!payload.question.trim()) {
      return;
    }
    setQuestion(payload.question);
    setMode(payload.mode);
    void search(payload);
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-4">
        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
        )}

        <SmartFAQForm
          question={question}
          mode={mode}
          isLoading={isLoading}
          onQuestionChange={setQuestion}
          onModeChange={setMode}
          onSubmit={handleSubmit}
        />

        <RecommendationsPanel
          recommendations={recommendations}
          onSelect={(selected) => setQuestion(selected)}
          onRefresh={() => void loadRecommendations()}
        />
      </div>

      <SmartFAQResult result={result} isLoading={isLoading} metrics={metrics} />
    </div>
  );
};
