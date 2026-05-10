import { useEffect } from 'react';
import { Slot, router, useSegments } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { secureStore } from '../src/utils/secure-store';
import { useAuthStore } from '../src/store/auth';
import { getSelfInfo } from '../src/api/auth';
import { requestNotificationPermission } from '../src/utils/notifications';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // Font files are downloaded in Task 12; fall back to loaded=true until then
  let loaded = true;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    [loaded] = useFonts({
      ShipporiMincho:   require('../assets/fonts/ShipporiMincho-Bold.ttf'),
      ZenKakuGothicNew: require('../assets/fonts/ZenKakuGothicNew-Regular.ttf'),
      JetBrainsMono:    require('../assets/fonts/JetBrainsMono-Regular.ttf'),
    });
  } catch {
    loaded = true;
  }

  const { setAuth, isAuthenticated } = useAuthStore();
  const segments = useSegments();

  // 起動時：保存済みトークンで自動ログイン
  useEffect(() => {
    if (!loaded) return;
    (async () => {
      const token = await secureStore.getToken();
      if (token) {
        try {
          const user = await getSelfInfo();
          setAuth(token, { username: user.username, email: user.email });
        } catch {
          await secureStore.clearToken();
        }
      }
      await SplashScreen.hideAsync();
      requestNotificationPermission(); // ノンブロッキング
    })();
  }, [loaded, setAuth]);

  // 認証状態に応じてリダイレクト
  useEffect(() => {
    if (!loaded) return;
    const inAuth = segments[0] === '(auth)';
    if (!isAuthenticated && !inAuth) router.replace('/(auth)/login');
    else if (isAuthenticated && inAuth) router.replace('/(tabs)/');
  }, [isAuthenticated, segments, loaded]);

  return <Slot />;
}
