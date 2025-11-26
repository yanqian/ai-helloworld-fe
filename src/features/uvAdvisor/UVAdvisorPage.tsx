import { UVAdvisorForm } from './components/UVAdvisorForm';
import { UVAdviceResult } from './components/UVAdviceResult';
import { useUVAdvisor } from './hooks/useUVAdvisor';

export const UVAdvisorPage = () => {
  const { fetchAdvice, advice, isLoading, error, metrics } = useUVAdvisor();

  return (
    <div className="grid w-full gap-6 md:grid-cols-2">
      <div className="space-y-4">
        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}
        <UVAdvisorForm onSubmit={fetchAdvice} isLoading={isLoading} />
      </div>

      <UVAdviceResult advice={advice} isLoading={isLoading} metrics={metrics} />
    </div>
  );
};
