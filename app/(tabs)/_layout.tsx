import { Tabs } from 'expo-router';
import { colors, fonts } from '../../src/constants/tokens';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'rgba(11,13,18,0.96)',
          borderTopColor: colors.line,
          borderTopWidth: 1,
          height: 84,
          paddingBottom: 24,
        },
        tabBarActiveTintColor:   colors.vermilion,
        tabBarInactiveTintColor: colors.textDim,
        tabBarLabelStyle: {
          fontFamily: fonts.jpBody,
          fontSize: 10,
          letterSpacing: 0.4,
        },
      }}
    >
      <Tabs.Screen name="index"    options={{ title: 'ホーム' }} />
      <Tabs.Screen name="charge"   options={{ title: 'チャージ' }} />
      <Tabs.Screen name="keys"     options={{ title: 'APIキー' }} />
      <Tabs.Screen name="usage"    options={{ title: '使用状況' }} />
      <Tabs.Screen name="invoices" options={{ title: '請求書' }} />
    </Tabs>
  );
}
