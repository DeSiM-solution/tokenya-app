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

function resolveTier(balanceJPY: number): Tier {
  if (balanceJPY >= 30000) return 'Gold';
  if (balanceJPY >= 10000) return 'Silver';
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
      // ⚠️ TODO: new-api の quota 単位を確認してから換算係数を決定すること。
      // 現在は仮換算: quota / 500 ≒ JPY
      const balanceJPY = Math.floor((d.quota ?? 0) / 500);
      set({
        balanceJPY,
        usedTokens: d.used_quota ?? 0,
        totalTokens: (d.quota ?? 0) + (d.used_quota ?? 0),
        tier: resolveTier(balanceJPY),
        loading: false,
      });
    } catch {
      set({ loading: false });
    }
  },
}));
