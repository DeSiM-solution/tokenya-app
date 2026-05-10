import React from 'react';
import { render } from '@testing-library/react-native';
import KeyCard from '../KeyCard';

const mockKey = {
  id: 1,
  name: 'テスト用キー',
  key:  'sk-tokenya-abc123xxxx',
  models: ['gpt-4o'],
  created_at: 1737000000,
};

describe('KeyCard', () => {
  it('キー名を表示する', () => {
    const { getByText } = render(<KeyCard apiKey={mockKey} onDelete={() => {}} />);
    expect(getByText('テスト用キー')).toBeTruthy();
  });

  it('デフォルトでキーをマスクする', () => {
    const { getByText } = render(<KeyCard apiKey={mockKey} onDelete={() => {}} />);
    // slice(0, 11) で 'sk-tokenya-' (ハイフン含む 11 文字) + マスク
    expect(getByText('sk-tokenya-••••••')).toBeTruthy();
  });
});
