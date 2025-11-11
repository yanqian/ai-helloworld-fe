import type { ReactNode } from 'react';

interface AppLayoutProps {
  children: ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => (
  <div className="flex min-h-screen flex-col bg-surface">
    <header className="border-b border-border bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">AI Assistant</p>
          <h1 className="text-xl font-semibold text-slate-900">Summaries & Keywords</h1>
        </div>
        <span className="text-sm text-slate-500">Connected to /api/v1</span>
      </div>
    </header>

    <main className="mx-auto flex w-full max-w-6xl flex-1 px-6 py-8">{children}</main>
  </div>
);
