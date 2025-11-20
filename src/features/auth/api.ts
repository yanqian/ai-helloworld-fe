import type { HttpClient } from '@/services/httpClient';
import type { LoginPayload, LoginResponse, RegisterPayload } from './types';

export interface AuthApi {
  register: (payload: RegisterPayload) => Promise<{ message: string }>;
  login: (payload: LoginPayload) => Promise<LoginResponse>;
}

export const createAuthApi = (httpClient: HttpClient): AuthApi => ({
  register: (payload) => httpClient.post('/api/v1/auth/register', payload),
  login: (payload) => httpClient.post('/api/v1/auth/login', payload),
});
