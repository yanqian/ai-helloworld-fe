import type { ReactNode } from 'react';
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';

interface AppLayoutProps {
  children: ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  const { isAuthenticated, email, nickname, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const links = [
    { to: '/', label: 'Summarizer' },
    { to: '/uv-advisor', label: 'UV Advisor' },
    { to: '/smart-faq', label: 'Smart FAQ' },
    { to: '/upload-ask', label: 'Upload & Ask' },
  ];

  const renderLinks = (stacked = false) => (
    <nav className={`flex ${stacked ? 'flex-col gap-2' : 'items-center gap-3'}`}>
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) =>
            `rounded-full px-4 py-2 text-sm transition ${
              stacked ? 'w-full text-left' : ''
            } ${isActive ? 'bg-primary/10 text-primary' : 'hover:text-slate-900'}`
          }
          onClick={() => stacked && setIsMenuOpen(false)}
        >
          {link.label}
        </NavLink>
      ))}
    </nav>
  );

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <header className="border-b border-border bg-white/80 backdrop-blur">
        <div className="mx-auto w-full max-w-6xl px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">AI Assistant</p>
              <h1 className="text-xl font-semibold text-slate-900">AI Helloworld Project</h1>
            </div>
            <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
              <div className="hidden items-center gap-3 md:flex">{renderLinks()}</div>
              {isAuthenticated ? (
                <div className="hidden items-center gap-2 md:flex">
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
                  className="hidden rounded-full border border-primary/40 px-3 py-1 text-xs font-semibold text-primary transition hover:bg-primary/10 md:inline-flex"
                >
                  Login
                </NavLink>
              )}
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-full border border-border px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-primary hover:text-primary md:hidden"
                onClick={() => setIsMenuOpen((prev) => !prev)}
                aria-expanded={isMenuOpen}
                aria-label="Toggle navigation"
              >
                Menu
              </button>
            </div>
          </div>

          <div
            className={`md:hidden ${isMenuOpen ? 'mt-3 flex flex-col gap-3' : 'hidden'}`}
          >
            {renderLinks(true)}
            {isAuthenticated ? (
              <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-xs font-medium text-slate-600">
                <span className="truncate">{nickname ?? email}</span>
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
                className="inline-flex items-center justify-center rounded-lg border border-primary/40 px-3 py-2 text-xs font-semibold text-primary transition hover:bg-primary/10"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </NavLink>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
        {children}
      </main>
    </div>
  );
};
