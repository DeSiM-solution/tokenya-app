import { create } from 'zustand';
import { apiClient } from '../api/client';

export type Tier = 'Bronze' | 'Silver' | 'Gold';

interface BalanceState {
  balanceJPY: number;
  tier: Tier;
  usedTokens: number;
  totalTokens: number;
  loading: boolean;
  refresh: () => Promise<void>;
}

// new-api quota units: 500,000 quota = $1 USD; exchange rate ~156.805154 JPY/USD
const QUOTA_PER_JPY = 500000 / 156.805154; // ≈ 3189

function groupToTier(group: string): Tier {
  const g = (group ?? '').toLowerCase();
  if (g === 'gold') return 'Gold';
  if (g === 'silver') return 'Silver';
  return 'Bronze';
}

export const useBalanceStore = create<BalanceState>((set) => ({
  balanceJPY: 0,
  tier: 'Bronze',
  usedTokens: 0,
  totalTokens: 0,
  loading: false,
  refresh: async () => {
    set({ loading: true });
    try {
      const res = await apiClient.get('/api/user/self');
      const d = res.data.data;
      const balanceJPY = Math.round((d.quota ?? 0) / QUOTA_PER_JPY);
      set({
        balanceJPY,
        usedTokens: d.used_quota ?? 0,
        totalTokens: (d.quota ?? 0) + (d.used_quota ?? 0),
        tier: groupToTier(d.group ?? ''),
        loading: false,
      });
    } catch {
      set({ loading: false });
    }
  },
}));
