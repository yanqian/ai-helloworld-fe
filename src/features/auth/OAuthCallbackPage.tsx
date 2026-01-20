import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';

const RETURN_PATH_KEY = 'oauthReturnPath';

const readParams = (search: string, hash: string) => {
  const searchParams = new URLSearchParams(search);
  const hashParams = new URLSearchParams(hash.startsWith('#') ? hash.slice(1) : hash);
  const getParam = (key: string) => searchParams.get(key) ?? hashParams.get(key);

  return {
    token: getParam('token') ?? '',
    refreshToken: getParam('refreshToken') ?? '',
    email: getParam('email') ?? '',
    nickname: getParam('nickname') ?? '',
    error: getParam('error') ?? '',
  };
};

export const OAuthCallbackPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const params = useMemo(() => readParams(location.search, location.hash), [location.hash, location.search]);

  useEffect(() => {
    if (params.error) {
      navigate('/login', { replace: true, state: { oauthError: params.error } });
      return;
    }

    if (!params.token || !params.refreshToken || !params.email || !params.nickname) {
      setError('We could not complete the Google sign-in. Please try again.');
      return;
    }

    login(params.token, params.refreshToken, params.email, params.nickname);
    const nextPath = sessionStorage.getItem(RETURN_PATH_KEY) ?? '/';
    sessionStorage.removeItem(RETURN_PATH_KEY);
    navigate(nextPath, { replace: true });
  }, [login, navigate, params]);

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col items-center justify-center py-12">
      <div className="w-full rounded-2xl border border-border bg-white p-8 text-center shadow-sm">
        {error ? (
          <>
            <h2 className="text-xl font-semibold text-slate-900">Sign-in failed</h2>
            <p className="mt-2 text-sm text-slate-600">{error}</p>
            <button
              type="button"
              onClick={() => navigate('/login', { replace: true })}
              className="mt-6 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/90"
            >
              Back to login
            </button>
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold text-slate-900">Completing sign-in</h2>
            <p className="mt-2 text-sm text-slate-600">Please wait while we finish signing you in.</p>
          </>
        )}
      </div>
    </div>
  );
};
