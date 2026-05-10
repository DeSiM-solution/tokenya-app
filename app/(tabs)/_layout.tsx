import { Tabs } from 'expo-router';
import { Feather } from '@expo/vector-icons';
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
      <Tabs.Screen name="index"    options={{ title: 'ホーム',   tabBarIcon: ({ color, size }) => <Feather name="home"        color={color} size={size} /> }} />
      <Tabs.Screen name="charge"   options={{ title: 'チャージ', tabBarIcon: ({ color, size }) => <Feather name="credit-card" color={color} size={size} /> }} />
      <Tabs.Screen name="keys"     options={{ title: 'キー',     tabBarIcon: ({ color, size }) => <Feather name="key"         color={color} size={size} /> }} />
      <Tabs.Screen name="usage"    options={{ title: '使用',     tabBarIcon: ({ color, size }) => <Feather name="bar-chart-2" color={color} size={size} /> }} />
      <Tabs.Screen name="invoices" options={{ title: '請求',     tabBarIcon: ({ color, size }) => <Feather name="file-text"   color={color} size={size} /> }} />
    </Tabs>
  );
}
