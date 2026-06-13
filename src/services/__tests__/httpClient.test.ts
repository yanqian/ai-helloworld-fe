import { createHttpClient } from '../httpClient';
import type { Logger } from '../logger';

const jsonResponse = (body: unknown, status = 200) =>
  ({
    ok: status >= 200 && status < 300,
    status,
    text: async () => JSON.stringify(body),
    json: async () => body,
  }) as Response;

const logger: Logger = {
  log: jest.fn(),
};

describe('createHttpClient auth contract', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
    delete (globalThis as { fetch?: unknown }).fetch;
  });

  it('attaches bearer tokens and retries once after a successful refresh', async () => {
    let token = 'old-token';
    const refreshSession = jest.fn(async () => {
      token = 'new-token';
      return true;
    });
    const fetchMock = jest
      .fn()
      .mockResolvedValueOnce(jsonResponse({ error: { message: 'expired' } }, 401))
      .mockResolvedValueOnce(jsonResponse({ ok: true }));
    globalThis.fetch = fetchMock as typeof fetch;

    const client = createHttpClient({
      baseUrl: 'https://api.example.test',
      logger,
      getAuthToken: () => token,
      refreshSession,
    });

    await expect(client.get<{ ok: boolean }>('/api/v1/auth/me')).resolves.toEqual({ ok: true });

    expect(refreshSession).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[0][1]?.headers).toMatchObject({ Authorization: 'Bearer old-token' });
    expect(fetchMock.mock.calls[1][1]?.headers).toMatchObject({ Authorization: 'Bearer new-token' });
  });
});
