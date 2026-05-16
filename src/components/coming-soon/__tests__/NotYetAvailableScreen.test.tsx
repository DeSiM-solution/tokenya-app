import { render, fireEvent } from '@testing-library/react-native';
import { Linking } from 'react-native';
import { NotYetAvailableScreen } from '../NotYetAvailableScreen';

describe('NotYetAvailableScreen', () => {
  it('renders label + 近日対応 headline', () => {
    const { getByText } = render(
      <NotYetAvailableScreen label="KOMOJU 連携" reason="決済ゲートウェイ統合は近日対応" />
    );
    expect(getByText('KOMOJU 連携')).toBeTruthy();
    expect(getByText('近日対応')).toBeTruthy();
    expect(getByText('決済ゲートウェイ統合は近日対応')).toBeTruthy();
  });

  it('cta opens URL via Linking', () => {
    const spy = jest.spyOn(Linking, 'openURL').mockResolvedValue(true);
    const { getByText } = render(
      <NotYetAvailableScreen
        label="KOMOJU 連携"
        cta={{ text: 'Web 版でチャージ →', href: 'https://app.tokenya.ai/topup' }}
      />
    );
    fireEvent.press(getByText('Web 版でチャージ →'));
    expect(spy).toHaveBeenCalledWith('https://app.tokenya.ai/topup');
    spy.mockRestore();
  });
});
