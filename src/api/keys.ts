import { apiClient } from './client';

export interface ApiKey {
  id:         number;
  name:       string;
  key:        string;
  models:     string[];
  created_at: number;
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
