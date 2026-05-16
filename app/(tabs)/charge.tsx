import { NotYetAvailableScreen } from '../../src/components/coming-soon/NotYetAvailableScreen';

export default function ChargeTab() {
  return (
    <NotYetAvailableScreen
      label="KOMOJU 連携"
      reason="決済ゲートウェイ統合は近日対応です。当面は Web 版でチャージしてください。"
      cta={{ text: 'Web 版でチャージ →', href: 'https://app.tokenya.ai/topup' }}
    />
  );
}
