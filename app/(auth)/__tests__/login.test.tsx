import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LoginScreen from '../login';
import { useAuthStore } from '../../../src/store/auth';

jest.mock('../../../src/api/auth', () => ({
  loginUser: jest.fn().mockResolvedValue('test-token'),
  getSelfInfo: jest.fn().mockResolvedValue({ username: 'taro', email: 'taro@example.com' }),
}));
jest.mock('../../../src/utils/secure-store', () => ({
  secureStore: { setToken: jest.fn(), getToken: jest.fn().mockResolvedValue(null), clearToken: jest.fn() },
}));
jest.mock('expo-router', () => ({ router: { replace: jest.fn() } }));

describe('LoginScreen', () => {
  beforeEach(() => {
    useAuthStore.setState({ token: null, user: null, isAuthenticated: false });
  });

  it('メールとパスワード入力欄が表示される', () => {
    const { getByPlaceholderText } = render(<LoginScreen />);
    expect(getByPlaceholderText('メールアドレス')).toBeTruthy();
    expect(getByPlaceholderText('パスワード')).toBeTruthy();
  });

  it('空白のままログインするとエラーが表示される', async () => {
    const { getByTestId, getByText } = render(<LoginScreen />);
    fireEvent.press(getByTestId('login-button'));
    await waitFor(() => {
      expect(getByText('メールアドレスを入力してください')).toBeTruthy();
    });
  });
});
