import React from 'react';
import { render } from '@testing-library/react-native';
import BalanceCard from '../BalanceCard';

describe('BalanceCard', () => {
  it('残高を整形して表示する', () => {
    const { getByText } = render(
      <BalanceCard balanceJPY={12500} tier="Silver" onCharge={() => {}} />
    );
    expect(getByText('12,500')).toBeTruthy();
  });

  it('チャージボタンが表示される', () => {
    const { getByText } = render(
      <BalanceCard balanceJPY={0} tier="Bronze" onCharge={() => {}} />
    );
    expect(getByText('クレジットを追加')).toBeTruthy();
  });
});
