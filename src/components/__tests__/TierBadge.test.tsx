import React from 'react';
import { render } from '@testing-library/react-native';
import TierBadge from '../TierBadge';

describe('TierBadge', () => {
  it('Bronze を表示する', () => {
    const { getByText } = render(<TierBadge tier="Bronze" />);
    expect(getByText('◆ Bronze')).toBeTruthy();
  });
  it('Gold を表示する', () => {
    const { getByText } = render(<TierBadge tier="Gold" />);
    expect(getByText('◆ Gold')).toBeTruthy();
  });
  it('Silver を表示する', () => {
    const { getByText } = render(<TierBadge tier="Silver" />);
    expect(getByText('◆ Silver')).toBeTruthy();
  });
});
