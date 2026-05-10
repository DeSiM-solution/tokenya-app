import { formatLowBalanceMessage } from '../notifications';

describe('formatLowBalanceMessage', () => {
  it('残高を含むメッセージを返す', () => {
    const msg = formatLowBalanceMessage(500);
    expect(msg).toContain('500');
    expect(msg).toContain('¥');
  });

  it('金額をカンマ区切りで整形する', () => {
    const msg = formatLowBalanceMessage(1000);
    expect(msg).toContain('1,000');
  });
});
