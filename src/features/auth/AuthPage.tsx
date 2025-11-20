import { FormEvent, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useServices } from '@/providers/ServiceProvider';
import { useAuth } from '@/providers/AuthProvider';
import { createAuthApi } from './api';

type Mode = 'login' | 'register';

const initialState = {
  email: '',
  password: '',
  nickname: '',
};

export const AuthPage = () => {
  const { httpClient } = useServices();
  const api = useMemo(() => createAuthApi(httpClient), [httpClient]);
  const { login } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState<Mode>('login');
  const [form, setForm] = useState(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleChange = (field: keyof typeof initialState) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const toggleMode = (nextMode: Mode) => {
    setMode(nextMode);
    setError(null);
    setMessage(null);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setIsSubmitting(true);

    try {
      if (mode === 'register') {
        await api.register({
          email: form.email,
          password: form.password,
          nickname: form.nickname,
        });
        setMessage('User registered successfully. You can now log in.');
        setForm((prev) => ({ ...prev, password: '' }));
        setMode('login');
        return;
      }
      const response = await api.login({ email: form.email, password: form.password });
      login(response.token, response.refreshToken, response.user.email, response.user.nickname);
      navigate('/', { replace: true });
    } catch (submitError) {
      setError((submitError as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col items-center justify-center py-12">
      <div className="w-full rounded-2xl border border-border bg-white p-8 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">AI Assistant</p>
            <h2 className="text-2xl font-semibold text-slate-900">
              {mode === 'login' ? 'Welcome back' : 'Create an account'}
            </h2>
          </div>
          <div className="inline-flex rounded-full bg-slate-100 p-1 text-sm font-medium">
            <button
              type="button"
              className={`rounded-full px-4 py-1 transition ${mode === 'login' ? 'bg-white text-primary shadow' : 'text-slate-500'}`}
              onClick={() => toggleMode('login')}
            >
              Login
            </button>
            <button
              type="button"
              className={`rounded-full px-4 py-1 transition ${mode === 'register' ? 'bg-white text-primary shadow' : 'text-slate-500'}`}
              onClick={() => toggleMode('register')}
            >
              Register
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
        )}
        {message && (
          <div className="mb-4 rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-600" htmlFor="nickname">
                Nickname
              </label>
              <input
                id="nickname"
                type="text"
                value={form.nickname}
                onChange={handleChange('nickname')}
                className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Up to 10 letters"
                maxLength={10}
                pattern="[A-Za-z]{1,10}"
                title="Nickname must contain only letters (A-Z) and be at most 10 characters."
                required
              />
            </div>
          )}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-600" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={handleChange('email')}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="user@example.com"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-600" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={form.password}
              onChange={handleChange('password')}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="********"
              minLength={8}
              required
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-primary/50"
          >
            {isSubmitting ? 'Please wait...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
};
