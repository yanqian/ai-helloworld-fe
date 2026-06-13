import { fireEvent, render, screen, waitFor } from '@testing-library/react';

jest.mock('@/utils/env', () => ({
  loadEnv: () => ({ apiBaseUrl: '', googleOauthEnabled: false }),
}));
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/providers/AuthProvider';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { OAuthCallbackPage } from '../OAuthCallbackPage';

const RefreshProbe = () => {
  const auth = useAuth();
  return (
    <div>
      <span data-testid="auth-state">{String(auth.isAuthenticated)}</span>
      <button type="button" onClick={() => void auth.refreshSession()}>
        refresh
      </button>
    </div>
  );
};

describe('AuthProvider session contract', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    jest.restoreAllMocks();
    delete (globalThis as { fetch?: unknown }).fetch;
  });

  it('redirects protected routes to login when unauthenticated', async () => {
    render(
      <MemoryRouter initialEntries={["/private"]}>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<div>Login page</div>} />
            <Route
              path="/private"
              element={
                <ProtectedRoute>
                  <div>Private page</div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </MemoryRouter>,
    );

    expect(await screen.findByText('Login page')).toBeInTheDocument();
    expect(screen.queryByText('Private page')).not.toBeInTheDocument();
  });

  it('clears stored auth state when refresh fails', async () => {
    localStorage.setItem('authToken', 'expired-token');
    localStorage.setItem('authRefreshToken', 'expired-refresh');
    localStorage.setItem('authEmail', 'user@example.com');
    localStorage.setItem('authNickname', 'User');
    const fetchMock = jest.fn().mockResolvedValue({
      ok: false,
      status: 401,
      text: async () => '{}',
      json: async () => ({}),
    } as Response);
    globalThis.fetch = fetchMock as typeof fetch;

    render(
      <MemoryRouter>
        <AuthProvider>
          <RefreshProbe />
        </AuthProvider>
      </MemoryRouter>,
    );

    expect(screen.getByTestId('auth-state')).toHaveTextContent('true');
    fireEvent.click(screen.getByRole('button', { name: /refresh/i }));

    await waitFor(() => expect(screen.getByTestId('auth-state')).toHaveTextContent('false'));
    expect(fetchMock).toHaveBeenCalledWith('/api/v1/auth/refresh', expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ refreshToken: 'expired-refresh' }),
    }));
    expect(localStorage.getItem('authToken')).toBeNull();
    expect(localStorage.getItem('authRefreshToken')).toBeNull();
    expect(localStorage.getItem('authEmail')).toBeNull();
    expect(localStorage.getItem('authNickname')).toBeNull();
  });

  it('stores Google OAuth callback tokens and navigates to the saved return path', async () => {
    sessionStorage.setItem('oauthReturnPath', '/upload-ask');

    render(
      <MemoryRouter
        initialEntries={[
          '/oauth/callback?token=access-token&refreshToken=refresh-token&email=user%40example.com&nickname=Tester',
        ]}
      >
        <AuthProvider>
          <Routes>
            <Route path="/oauth/callback" element={<OAuthCallbackPage />} />
            <Route path="/upload-ask" element={<div>Upload Ask page</div>} />
          </Routes>
        </AuthProvider>
      </MemoryRouter>,
    );

    expect(await screen.findByText('Upload Ask page')).toBeInTheDocument();
    expect(localStorage.getItem('authToken')).toBe('access-token');
    expect(localStorage.getItem('authRefreshToken')).toBe('refresh-token');
    expect(localStorage.getItem('authEmail')).toBe('user@example.com');
    expect(localStorage.getItem('authNickname')).toBe('Tester');
    expect(sessionStorage.getItem('oauthReturnPath')).toBeNull();
  });
});
