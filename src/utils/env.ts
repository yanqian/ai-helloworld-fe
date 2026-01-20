interface AppEnv {
  apiBaseUrl: string;
  googleOauthEnabled: boolean;
}

const resolveBaseUrl = (): string => {
  const explicit = import.meta?.env?.VITE_API_BASE_URL;
  if (typeof explicit === 'string' && explicit.length > 0) {
    return explicit;
  }

  if (import.meta.env.DEV) {
    return '';
  }

  return '/api';
};

export const loadEnv = (): AppEnv => ({
  apiBaseUrl: resolveBaseUrl(),
  googleOauthEnabled: (import.meta?.env?.VITE_GOOGLE_OAUTH_ENABLED ?? '').toString().toLowerCase() === 'true',
});
