import { apiClient } from './client';

export type Period = 'today' | 'week' | 'month';

export interface ModelUsage {
  model:   string;
  tokens:  number;
  costJPY: number;
}

export interface DailyUsage {
  date:    string;   // 'YYYY-MM-DD'
  costJPY: number;
}

export interface UsageSummary {
  byModel:       ModelUsage[];
  totalTokens:   number;
  totalCostJPY:  number;
  daily?:        DailyUsage[];
  tierName?:     string;
  tierProgress?: number;  // 0-1
  requestCount?: number;
}

export async function getUsageSummary(period: Period = 'month'): Promise<UsageSummary> {
  const res = await apiClient.get('/api/user/self/usage', { params: { period } });
  return res.data.data ?? { byModel: [], totalTokens: 0, totalCostJPY: 0 };
}
