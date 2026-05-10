import { formatJPY, formatDate, formatTokens } from '../format';

describe('formatJPY', () => {
  it('整数円を整形する', () => {
    expect(formatJPY(1000)).toBe('¥1,000');
  });
  it('0円を整形する', () => {
    expect(formatJPY(0)).toBe('¥0');
  });
  it('大きな金額を整形する', () => {
    expect(formatJPY(100000)).toBe('¥100,000');
  });
});

describe('formatDate', () => {
  it('Unix タイムスタンプを日付文字列に変換する', () => {
    expect(formatDate(1768521600)).toMatch(/2026/);
  });
});

describe('formatTokens', () => {
  it('1000以上は K 表記にする', () => {
    expect(formatTokens(1500)).toBe('1.5K');
  });
  it('1000未満はそのまま', () => {
    expect(formatTokens(500)).toBe('500');
  });
});
