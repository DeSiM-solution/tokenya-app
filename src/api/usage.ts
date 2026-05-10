import { apiClient } from './client';

export interface ModelUsage {
  model:   string;
  tokens:  number;
  costJPY: number;
}

export interface UsageSummary {
  byModel:      ModelUsage[];
  totalTokens:  number;
  totalCostJPY: number;
}

export async function getUsageSummary(): Promise<UsageSummary> {
  const res = await apiClient.get('/api/user/self/usage');
  return res.data.data ?? { byModel: [], totalTokens: 0, totalCostJPY: 0 };
}
