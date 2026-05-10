import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge:  false,
  }),
});

export async function requestNotificationPermission(): Promise<boolean> {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

function fmtJPY(n: number): string {
  return '¥' + Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function formatLowBalanceMessage(balanceJPY: number): string {
  return `残高が${fmtJPY(balanceJPY)}になりました。チャージをお忘れなく。`;
}

export async function scheduleLowBalanceAlert(balanceJPY: number): Promise<void> {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'トークン屋 — 残高のお知らせ',
      body:  formatLowBalanceMessage(balanceJPY),
    },
    trigger: null,
  });
}
