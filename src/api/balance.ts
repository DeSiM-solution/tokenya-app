import { apiClient } from './client';

/**
 * @deprecated Phase 1 only — KOMOJU integration arrives in Phase 2 backend.
 * The Charge tab uses NotYetAvailableScreen and never calls this in Phase 1.
 */
export async function createTopUpOrder(
  amountJPY: number,
): Promise<{ checkout_url: string; topup_id: number }> {
  const res = await apiClient.post('/api/user/self/topup', { amount: amountJPY });
  return res.data.data;
}
