import { apiClient } from './client';

export interface UserInfo {
  username:   string;
  email:      string;
  quota:      number;
  used_quota: number;
  group:      string;
}

export async function loginUser(username: string, password: string): Promise<string> {
  const res = await apiClient.post('/api/user/login', { username, password });
  return res.data.data.token as string;
}

export async function getSelfInfo(): Promise<UserInfo> {
  const res = await apiClient.get('/api/user/self');
  return res.data.data as UserInfo;
}

export async function registerUser(username: string, email: string, password: string): Promise<void> {
  const res = await apiClient.post('/api/user/register', { username, password, email });
  if (!res.data.success) {
    throw new Error(res.data.message ?? '登録に失敗しました');
  }
}

export async function sendPasswordResetEmail(email: string): Promise<void> {
  const res = await apiClient.get('/api/reset_password', { params: { email } });
  if (!res.data.success) {
    throw new Error(res.data.message ?? 'メール送信に失敗しました');
  }
}

export async function confirmPasswordReset(email: string, token: string): Promise<string> {
  const res = await apiClient.post('/api/user/reset', { email, token });
  if (!res.data.success) {
    throw new Error(res.data.message ?? 'パスワードリセットに失敗しました');
  }
  return res.data.data as string;
}
