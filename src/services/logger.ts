export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface Logger {
  log: (level: LogLevel, message: string, meta?: Record<string, unknown>) => void;
}

export const createConsoleLogger = (): Logger => ({
  log: (level, message, meta) => {
    const payload = meta ? `${message} ${JSON.stringify(meta)}` : message;
    // eslint-disable-next-line no-console
    console[level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'log'](
      `[${level.toUpperCase()}] ${payload}`,
    );
  },
});
