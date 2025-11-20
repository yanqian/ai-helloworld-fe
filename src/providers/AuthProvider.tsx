import {
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import { loadEnv } from '@/utils/env';
import type { LoginResponse } from '@/features/auth/types';

interface AuthContextValue {
  token: string | null;
  refreshToken: string | null;
  email: string | null;
  nickname: string | null;
  isAuthenticated: boolean;
  login: (token: string, refreshToken: string, email: string, nickname: string) => void;
  logout: () => void;
  refreshSession: () => Promise<boolean>;
}

const TOKEN_KEY = 'authToken';
const REFRESH_KEY = 'authRefreshToken';
const EMAIL_KEY = 'authEmail';
const NICKNAME_KEY = 'authNickname';

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const buildUrl = (base: string, path: string) => {
  if (!base) {
    return path;
  }
  return `${base.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const env = loadEnv();
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [refreshToken, setRefreshToken] = useState<string | null>(() =>
    localStorage.getItem(REFRESH_KEY),
  );
  const [email, setEmail] = useState<string | null>(() => localStorage.getItem(EMAIL_KEY));
  const [nickname, setNickname] = useState<string | null>(() => localStorage.getItem(NICKNAME_KEY));

  const persistSession = useCallback(
    (nextToken: string, nextRefresh: string, userEmail: string, userNickname: string) => {
      setToken(nextToken);
      setRefreshToken(nextRefresh);
      setEmail(userEmail);
      setNickname(userNickname);
      localStorage.setItem(TOKEN_KEY, nextToken);
      localStorage.setItem(REFRESH_KEY, nextRefresh);
      localStorage.setItem(EMAIL_KEY, userEmail);
      localStorage.setItem(NICKNAME_KEY, userNickname);
    },
    [],
  );

  const login = useCallback(
    (nextToken: string, nextRefresh: string, userEmail: string, userNickname: string) => {
      persistSession(nextToken, nextRefresh, userEmail, userNickname);
    },
    [persistSession],
  );

  const logout = useCallback(() => {
    setToken(null);
    setRefreshToken(null);
    setEmail(null);
    setNickname(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(EMAIL_KEY);
    localStorage.removeItem(NICKNAME_KEY);
  }, []);

  const refreshSession = useCallback(async () => {
    if (!refreshToken) {
      return false;
    }
    try {
      const response = await fetch(buildUrl(env.apiBaseUrl, '/api/v1/auth/refresh'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });
      if (!response.ok) {
        logout();
        return false;
      }
      const data = (await response.json()) as LoginResponse;
      persistSession(data.token, data.refreshToken, data.user.email, data.user.nickname);
      return true;
    } catch {
      logout();
      return false;
    }
  }, [env.apiBaseUrl, logout, persistSession, refreshToken]);

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      refreshToken,
      email,
      nickname,
      isAuthenticated: Boolean(token && refreshToken),
      login,
      logout,
      refreshSession,
    }),
    [email, login, logout, refreshSession, refreshToken, token],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
};
