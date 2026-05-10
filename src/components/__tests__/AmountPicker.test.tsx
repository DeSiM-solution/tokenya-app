import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import AmountPicker from '../AmountPicker';

const AMOUNTS = [1000, 3000, 5000, 10000, 30000, 50000];

describe('AmountPicker', () => {
  it('全金額オプションを表示する', () => {
    const { getByText } = render(<AmountPicker amounts={AMOUNTS} selected={1000} onSelect={() => {}} />);
    expect(getByText('¥1,000')).toBeTruthy();
    expect(getByText('¥50,000')).toBeTruthy();
  });

  it('選択時に onSelect が正しい金額で呼ばれる', () => {
    const onSelect = jest.fn();
    const { getByText } = render(<AmountPicker amounts={AMOUNTS} selected={1000} onSelect={onSelect} />);
    fireEvent.press(getByText('¥5,000'));
    expect(onSelect).toHaveBeenCalledWith(5000);
  });
});
