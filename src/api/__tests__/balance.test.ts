import * as balance from '../balance';
import { apiClient } from '../client';

jest.mock('../client', () => ({
  apiClient: { post: jest.fn() },
}));

describe('balance API', () => {
  beforeEach(() => jest.clearAllMocks());

  it('getTopUps is no longer exported', () => {
    expect((balance as any).getTopUps).toBeUndefined();
  });

  it('createTopUpOrder still exists and POSTs /api/user/self/topup', async () => {
    (apiClient.post as jest.Mock).mockResolvedValue({
      data: { data: { checkout_url: 'https://komoju/x', topup_id: 1 } },
    });
    const r = await balance.createTopUpOrder(3000);
    expect(apiClient.post).toHaveBeenCalledWith('/api/user/self/topup', { amount: 3000 });
    expect(r.checkout_url).toBe('https://komoju/x');
  });
});
