export function formatJPY(amount: number): string {
  return '¥' + new Intl.NumberFormat('en-US').format(amount);
}

export function formatDate(unixSec: number): string {
  return new Date(unixSec * 1000).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatTokens(count: number): string {
  if (count >= 1000) {
    const k = count / 1000;
    return (k % 1 === 0 ? k.toFixed(0) : k.toFixed(1)) + 'K';
  }
  return String(count);
}
