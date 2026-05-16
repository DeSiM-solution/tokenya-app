import { NotYetAvailableScreen } from '../../src/components/coming-soon/NotYetAvailableScreen';

export default function InvoicesTab() {
  return (
    <NotYetAvailableScreen
      label="適格請求書"
      reason="適格請求書 (T13 番号) PDF の生成は近日対応です。Web 版で確認できます。"
      cta={{ text: 'Web 版で確認 →', href: 'https://app.tokenya.ai/invoices' }}
    />
  );
}
