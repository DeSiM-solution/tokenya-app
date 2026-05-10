import { apiClient } from './client';

export interface TopUp {
  id:         number;
  amount:     number;  // JPY
  status:     string;
  created_at: number;
}

// Used by T9: 使用状況・請求書画面
export async function getTopUps(): Promise<TopUp[]> {
  const res = await apiClient.get('/api/user/self/topup');
  return res.data.data ?? [];
}

export async function createTopUpOrder(amountJPY: number): Promise<{ checkout_url: string; topup_id: number }> {
  const res = await apiClient.post('/api/user/self/topup', { amount: amountJPY });
  return res.data.data;
}
