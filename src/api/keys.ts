import { apiClient } from './client';

export interface ApiKey {
  id:         number;
  name:       string;
  key:        string;
  models:     string[];
  created_at: number;
  status?:    number;      // 1 = active (default), 0 = disabled
  today_jpy?: number;
  month_jpy?: number;
  last_used?: number | null; // unix timestamp or null
}

export async function listKeys(): Promise<ApiKey[]> {
  const res = await apiClient.get('/api/user/self/token');
  return res.data.data ?? [];
}

export async function createKey(name: string, models: string[]): Promise<ApiKey> {
  const res = await apiClient.post('/api/user/self/token', { name, models });
  return res.data.data;
}

export async function deleteKey(id: number): Promise<void> {
  await apiClient.delete(`/api/user/self/token/${id}`);
}
