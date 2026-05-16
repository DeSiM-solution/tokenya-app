import { apiClient } from './client';

export interface ApiKey {
  id:         number;
  name:       string;
  key:        string;
  models:     string[];
  created_at: number;
  status?:    number;
  // JP fields below are populated by Phase 2 backend extensions; null in Phase 1
  today_jpy?: number | null;
  month_jpy?: number | null;
  last_used?: number | null;
}

export async function listKeys(): Promise<ApiKey[]> {
  const res = await apiClient.get('/api/token/');
  return res.data.data ?? [];
}

export async function createKey(name: string, models: string[]): Promise<ApiKey> {
  const res = await apiClient.post('/api/token/', { name, models });
  return res.data.data;
}

export async function deleteKey(id: number): Promise<void> {
  await apiClient.delete(`/api/token/${id}`);
}
