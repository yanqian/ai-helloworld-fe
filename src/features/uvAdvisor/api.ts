import type { HttpClient } from '@/services/httpClient';
import type { UVAdviceRequest, UVAdviceResponse } from './types';

const PATH = '/api/v1/uv-advice';

export interface UVAdvisorApi {
  fetchAdvice: (payload: UVAdviceRequest, signal?: AbortSignal) => Promise<UVAdviceResponse>;
}

export const createUVAdvisorApi = (httpClient: HttpClient): UVAdvisorApi => ({
  fetchAdvice: (payload, signal) => httpClient.post(PATH, payload ?? {}, signal),
});
