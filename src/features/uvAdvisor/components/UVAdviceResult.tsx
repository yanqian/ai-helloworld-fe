import { RequestStats } from '@/components/common/RequestStats';
import type { RequestMetrics } from '@/types/metrics';
import type { UVAdviceResponse } from '../types';

interface Props {
  advice?: UVAdviceResponse;
  isLoading: boolean;
  metrics?: RequestMetrics;
}

const categoryLabels: Record<string, string> = {
  low: 'Low',
  moderate: 'Moderate',
  high: 'High',
  very_high: 'Very High',
  extreme: 'Extreme',
};

const formatTime = (value?: string) => {
  if (!value) {
    return '—';
  }

  const date = new Date(value);
  return new Intl.DateTimeFormat('en-SG', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date);
};

const formatDate = (value?: string) => {
  if (!value) {
    return '—';
  }
  return new Intl.DateTimeFormat('en-SG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(value));
};

const SectionList = ({ title, items }: { title: string; items: string[] }) => (
  <article className="rounded-xl border border-slate-200 bg-white/80 p-4 shadow-sm">
    <p className="text-sm font-semibold text-slate-600">{title}</p>
    {items.length > 0 ? (
      <ul className="mt-3 list-inside list-disc text-sm text-slate-800">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    ) : (
      <p className="mt-3 text-sm text-slate-500">No suggestions yet.</p>
    )}
  </article>
);

export const UVAdviceResult = ({ advice, isLoading, metrics }: Props) => {
  const hasAdvice = Boolean(advice);
  const category = categoryLabels[advice?.category ?? ''] ?? advice?.category ?? '—';

  return (
    <section className="space-y-5 rounded-xl border border-border bg-white p-5 shadow-sm">
      <header className="flex flex-wrap items-baseline justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">UV Advisor</p>
          <h2 className="text-lg font-semibold text-slate-900">Clothing & Protection planner</h2>
        </div>
        {advice?.date && (
          <span className="text-sm text-slate-500">
            Data for {formatDate(advice.date)} · Source:{' '}
            <a
              href={advice.source}
              target="_blank"
              rel="noreferrer"
              className="text-primary underline-offset-2 hover:underline"
            >
              data.gov.sg
            </a>
          </span>
        )}
      </header>

      {isLoading && (
        <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
          Fetching the latest UV readings…
        </div>
      )}

      {!hasAdvice && !isLoading && (
        <p className="text-sm text-slate-600">
          Submit a date to generate outfit inspiration and sun protection reminders tailored to the
          UV index in Singapore.
        </p>
      )}

      {hasAdvice && (
        <div className="space-y-5">
          <article className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
            <p className="text-sm font-semibold text-slate-700">Summary</p>
            <p className="mt-2 text-slate-800">{advice?.summary}</p>
          </article>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border border-slate-200 p-3">
              <p className="text-xs uppercase text-slate-500">Max UV</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">{advice?.maxUv ?? '—'}</p>
            </div>
            <div className="rounded-lg border border-slate-200 p-3">
              <p className="text-xs uppercase text-slate-500">Risk level</p>
              <p className="mt-1 text-xl font-semibold text-slate-900">{category}</p>
            </div>
            <div className="rounded-lg border border-slate-200 p-3">
              <p className="text-xs uppercase text-slate-500">Peak hour</p>
              <p className="mt-1 text-xl font-semibold text-slate-900">{formatTime(advice?.peakHour)}</p>
            </div>
            <div className="rounded-lg border border-slate-200 p-3">
              <p className="text-xs uppercase text-slate-500">Last updated</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">
                {formatDate(advice?.dataTimestamp ?? advice?.peakHour)}
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <SectionList title="Clothing ideas" items={advice?.clothing ?? []} />
            <SectionList title="Protection reminders" items={advice?.protection ?? []} />
          </div>

          <SectionList title="Extra tips" items={advice?.tips ?? []} />

          <article>
            <p className="text-sm font-semibold text-slate-700">Hourly UV readings</p>
            {advice?.readings?.length ? (
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {advice.readings.slice(0, 10).map((reading) => (
                  <li
                    key={reading.hour}
                    className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700"
                  >
                    <span>{formatTime(reading.hour)}</span>
                    <span className="font-semibold">{reading.value}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-slate-500">No hourly data available.</p>
            )}
          </article>

          <RequestStats metrics={metrics} isLoading={isLoading} title="Last run" />
        </div>
      )}
    </section>
  );
};
