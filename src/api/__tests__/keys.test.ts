import { listKeys, createKey, deleteKey } from '../keys';
import { apiClient } from '../client';

jest.mock('../client', () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
  },
}));

describe('keys API', () => {
  beforeEach(() => jest.clearAllMocks());

  it('listKeys hits /api/token/', async () => {
    (apiClient.get as jest.Mock).mockResolvedValue({ data: { data: [] } });
    await listKeys();
    expect(apiClient.get).toHaveBeenCalledWith('/api/token/');
  });

  it('createKey POSTs /api/token/', async () => {
    (apiClient.post as jest.Mock).mockResolvedValue({
      data: { data: { id: 1, name: 'k', key: 'sk-xxx', models: [], created_at: 0 } },
    });
    await createKey('k', ['gpt-5']);
    expect(apiClient.post).toHaveBeenCalledWith('/api/token/', { name: 'k', models: ['gpt-5'] });
  });

  it('deleteKey hits /api/token/:id', async () => {
    (apiClient.delete as jest.Mock).mockResolvedValue({});
    await deleteKey(42);
    expect(apiClient.delete).toHaveBeenCalledWith('/api/token/42');
  });
});
