import { useAuthStore } from '../auth';
import { renderHook, act } from '@testing-library/react-native';

describe('useAuthStore', () => {
  beforeEach(() => useAuthStore.setState({ token: null, user: null, isAuthenticated: false }));

  it('初期状態は未認証', () => {
    const { result } = renderHook(() => useAuthStore());
    expect(result.current.token).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('setAuth でトークンとユーザーがセットされる', () => {
    const { result } = renderHook(() => useAuthStore());
    act(() => {
      result.current.setAuth('jwt-token', { username: 'taro', email: 'taro@example.com' });
    });
    expect(result.current.token).toBe('jwt-token');
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('clearAuth でリセットされる', () => {
    const { result } = renderHook(() => useAuthStore());
    act(() => {
      result.current.setAuth('jwt-token', { username: 'taro', email: 'taro@example.com' });
      result.current.clearAuth();
    });
    expect(result.current.token).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });
});
