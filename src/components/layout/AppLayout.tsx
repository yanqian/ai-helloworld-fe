import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';

interface AppLayoutProps {
  children: ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => (
  <div className="flex min-h-screen flex-col bg-surface">
    <header className="border-b border-border bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">AI Assistant</p>
          <h1 className="text-xl font-semibold text-slate-900">Summaries & UV planner</h1>
        </div>
        <nav className="flex items-center gap-3 text-sm font-medium text-slate-600">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `rounded-full px-4 py-2 transition ${
                isActive ? 'bg-primary/10 text-primary' : 'hover:text-slate-900'
              }`
            }
          >
            Summarizer
          </NavLink>
          <NavLink
            to="/uv-advisor"
            className={({ isActive }) =>
              `rounded-full px-4 py-2 transition ${
                isActive ? 'bg-primary/10 text-primary' : 'hover:text-slate-900'
              }`
            }
          >
            UV Advisor
          </NavLink>
        </nav>
      </div>
    </header>

    <main className="mx-auto flex w-full max-w-6xl flex-1 px-6 py-8">{children}</main>
  </div>
);
