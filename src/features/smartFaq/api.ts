import type { HttpClient } from '@/services/httpClient';
import type {
  SmartFAQRequest,
  SmartFAQResponse,
  TrendingResponse,
} from './types';

const SEARCH_PATH = '/api/v1/faq/search';
const TRENDING_PATH = '/api/v1/faq/trending';

export interface SmartFAQApi {
  search: (payload: SmartFAQRequest, signal?: AbortSignal) => Promise<SmartFAQResponse>;
  fetchTrending: (signal?: AbortSignal) => Promise<TrendingResponse>;
}

export const createSmartFAQApi = (httpClient: HttpClient): SmartFAQApi => ({
  search: (payload, signal) => httpClient.post(SEARCH_PATH, payload, signal),
  fetchTrending: (signal) => httpClient.get(TRENDING_PATH, signal),
});
