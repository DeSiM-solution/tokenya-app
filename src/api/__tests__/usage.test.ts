import { getUsageSummary } from '../usage';
import { apiClient } from '../client';

jest.mock('../client', () => ({
  apiClient: { get: jest.fn() },
}));

describe('getUsageSummary', () => {
  beforeEach(() => jest.clearAllMocks());

  it('hits /api/user/self/dashboard with period param', async () => {
    (apiClient.get as jest.Mock).mockResolvedValue({
      data: { data: { byModel: [], totalTokens: 0, totalCostJPY: 0 } },
    });
    await getUsageSummary('week');
    expect(apiClient.get).toHaveBeenCalledWith('/api/user/self/dashboard', {
      params: { period: 'week' },
    });
  });

  it('returns empty summary when api returns null data', async () => {
    (apiClient.get as jest.Mock).mockResolvedValue({ data: { data: null } });
    const result = await getUsageSummary();
    expect(result).toEqual({ byModel: [], totalTokens: 0, totalCostJPY: 0 });
  });
});
