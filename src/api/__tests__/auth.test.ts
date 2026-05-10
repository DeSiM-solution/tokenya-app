import { loginUser, getSelfInfo } from '../auth';
import { apiClient } from '../client';

jest.mock('../client', () => ({
  apiClient: {
    post: jest.fn(),
    get:  jest.fn(),
    interceptors: { request: { use: jest.fn() } },
  },
}));

const mockPost = apiClient.post as jest.Mock;
const mockGet  = apiClient.get  as jest.Mock;

describe('loginUser', () => {
  it('成功時にトークンを返す', async () => {
    mockPost.mockResolvedValueOnce({ data: { data: { token: 'test-jwt-token' } } });
    const token = await loginUser('user@example.com', 'password');
    expect(token).toBe('test-jwt-token');
    expect(mockPost).toHaveBeenCalledWith('/api/user/login', {
      username: 'user@example.com',
      password: 'password',
    });
  });

  it('認証失敗時に例外を投げる', async () => {
    mockPost.mockRejectedValueOnce({ response: { status: 401 } });
    await expect(loginUser('bad@example.com', 'wrong')).rejects.toBeDefined();
  });
});

describe('getSelfInfo', () => {
  it('ユーザー情報を返す', async () => {
    mockGet.mockResolvedValueOnce({ data: { data: { username: 'taro', email: 'taro@example.com', quota: 0, used_quota: 0 } } });
    const info = await getSelfInfo();
    expect(info.username).toBe('taro');
  });
});
