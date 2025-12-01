import type { ReactNode } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';

interface AppLayoutProps {
  children: ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  const { isAuthenticated, email, nickname, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <header className="border-b border-border bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">AI Assistant</p>
            <h1 className="text-xl font-semibold text-slate-900">AI Helloworld Project</h1>
          </div>
          <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
            <nav className="flex items-center gap-3">
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
              <NavLink
                to="/smart-faq"
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 transition ${
                    isActive ? 'bg-primary/10 text-primary' : 'hover:text-slate-900'
                  }`
                }
              >
                Smart FAQ
              </NavLink>
              <NavLink
                to="/upload-ask"
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 transition ${
                    isActive ? 'bg-primary/10 text-primary' : 'hover:text-slate-900'
                  }`
                }
              >
                Upload & Ask
              </NavLink>
            </nav>
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wide text-slate-500">
                  {nickname ?? email}
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-full border border-border px-3 py-1 text-xs font-semibold text-slate-600 transition hover:border-primary hover:text-primary"
                >
                  Logout
                </button>
              </div>
            ) : (
              <NavLink
                to="/login"
                className="rounded-full border border-primary/40 px-3 py-1 text-xs font-semibold text-primary transition hover:bg-primary/10"
              >
                Login
              </NavLink>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 px-6 py-8">{children}</main>
    </div>
  );
};
