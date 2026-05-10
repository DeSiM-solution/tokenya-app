import { apiClient } from './client';

export interface UserInfo {
  username:   string;
  email:      string;
  quota:      number;
  used_quota: number;
}

export async function loginUser(username: string, password: string): Promise<string> {
  const res = await apiClient.post('/api/user/login', { username, password });
  return res.data.data.token as string;
}

export async function getSelfInfo(): Promise<UserInfo> {
  const res = await apiClient.get('/api/user/self');
  return res.data.data as UserInfo;
}
