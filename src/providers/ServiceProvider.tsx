import { createContext, useContext, type ReactNode, useMemo } from 'react';
import { createHttpClient, type HttpClient } from '@/services/httpClient';
import { createConsoleLogger, type Logger } from '@/services/logger';
import { loadEnv } from '@/utils/env';
import { useAuth } from './AuthProvider';

interface ServicesContextValue {
  httpClient: HttpClient;
  logger: Logger;
  apiBaseUrl: string;
}

const ServicesContext = createContext<ServicesContextValue | undefined>(undefined);

export const ServiceProvider = ({ children }: { children: ReactNode }) => {
  const env = loadEnv();
  const { token, refreshSession } = useAuth();
  const logger = useMemo(() => createConsoleLogger(), []);
  const httpClient = useMemo(
    () =>
      createHttpClient({
        baseUrl: env.apiBaseUrl,
        logger,
        getAuthToken: () => token,
        refreshSession,
      }),
    [env.apiBaseUrl, logger, refreshSession, token],
  );

  const value = useMemo(
    () => ({ httpClient, logger, apiBaseUrl: env.apiBaseUrl }),
    [httpClient, logger, env.apiBaseUrl],
  );

  return <ServicesContext.Provider value={value}>{children}</ServicesContext.Provider>;
};

export const useServices = (): ServicesContextValue => {
  const context = useContext(ServicesContext);
  if (!context) {
    throw new Error('useServices must be used within ServiceProvider');
  }

  return context;
};
