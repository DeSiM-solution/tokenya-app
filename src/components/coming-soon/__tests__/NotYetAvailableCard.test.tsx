import { render, fireEvent } from '@testing-library/react-native';
import { Linking } from 'react-native';
import { NotYetAvailableCard } from '../NotYetAvailableCard';

describe('NotYetAvailableCard', () => {
  it('renders label only', () => {
    const { getByText, queryByText } = render(<NotYetAvailableCard label="残高" />);
    expect(getByText('残高')).toBeTruthy();
    expect(getByText('近日対応')).toBeTruthy();
    expect(queryByText(/JPY 換算/)).toBeNull();
  });

  it('renders reason when provided', () => {
    const { getByText } = render(
      <NotYetAvailableCard label="残高" reason="JPY 換算は近日対応" />
    );
    expect(getByText('JPY 換算は近日対応')).toBeTruthy();
  });

  it('renders cta and calls Linking.openURL on press', () => {
    const spy = jest.spyOn(Linking, 'openURL').mockResolvedValue(true);
    const { getByText } = render(
      <NotYetAvailableCard
        label="残高"
        cta={{ text: 'Web 版で確認 →', href: 'https://app.tokenya.ai/balance' }}
      />
    );
    fireEvent.press(getByText('Web 版で確認 →'));
    expect(spy).toHaveBeenCalledWith('https://app.tokenya.ai/balance');
    spy.mockRestore();
  });
});
