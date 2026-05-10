import React, { useEffect } from 'react';
import { ScrollView, Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBalanceStore } from '../../src/store/balance';
import { useAuthStore } from '../../src/store/auth';
import BalanceCard from '../../src/components/BalanceCard';
import UsageCard from '../../src/components/UsageCard';
import ActivityList, { type Activity } from '../../src/components/ActivityList';
import { colors, fonts } from '../../src/constants/tokens';

// 実 API が繋がるまでのプレースホルダー
const MOCK_ACTIVITY: Activity[] = [
  { id: 1, model: 'claude-opus-4',  tokens: 12400, costJPY: 248, createdAt: 1737000000 },
  { id: 2, model: 'gpt-4o',         tokens:  5200, costJPY: 104, createdAt: 1736990000 },
  { id: 3, model: 'gemini-2.5-pro', tokens:  3100, costJPY:  62, createdAt: 1736980000 },
];

const QUICK = [
  { label: 'チャージ',   route: '/(tabs)/charge'   },
  { label: 'APIキー',   route: '/(tabs)/keys'     },
  { label: '使用状況',  route: '/(tabs)/usage'    },
  { label: '請求書',    route: '/(tabs)/invoices' },
] as const;

export default function HomeScreen() {
  const { balanceJPY, tier, usedTokens, totalTokens, refresh } = useBalanceStore();
  const { user } = useAuthStore();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { refresh(); }, []);

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* ヘッダー */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greet}>おかえりなさい</Text>
            <Text style={styles.title}>
              トークン<Text style={styles.ya}>屋</Text>
            </Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/settings')} style={styles.avatar}>
            <Text style={styles.avatarTxt}>{user?.username?.[0]?.toUpperCase() ?? 'U'}</Text>
          </TouchableOpacity>
        </View>

        <BalanceCard balanceJPY={balanceJPY} tier={tier} onCharge={() => router.push('/(tabs)/charge')} />
        <UsageCard usedTokens={usedTokens} totalTokens={totalTokens} />

        <Text style={styles.sectionH}>クイックアクション</Text>
        <View style={styles.quickGrid}>
          {QUICK.map((a) => (
            <TouchableOpacity key={a.label} style={styles.quickItem} onPress={() => router.push(a.route)}>
              <Text style={styles.quickLabel}>{a.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionH}>最近の使用</Text>
        <ActivityList items={MOCK_ACTIVITY} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root:       { flex: 1, backgroundColor: colors.ink },
  content:    { padding: 20, paddingBottom: 100 },
  header:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 8 },
  greet:      { fontFamily: fonts.jpBody, fontSize: 13, color: colors.textMuted },
  title:      { fontFamily: fonts.jpDisplay, fontSize: 20, fontWeight: '700', color: colors.text },
  ya:         { color: colors.vermilion },
  avatar:     { width: 36, height: 36, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.lineStrong, alignItems: 'center', justifyContent: 'center' },
  avatarTxt:  { fontFamily: fonts.jpDisplay, fontSize: 14, fontWeight: '700', color: colors.text },
  sectionH:   { fontFamily: fonts.mono, fontSize: 10, letterSpacing: 2.5, textTransform: 'uppercase', color: colors.textDim, marginTop: 28, marginBottom: 14 },
  quickGrid:  { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  quickItem:  { flex: 1, minWidth: '40%', backgroundColor: colors.ink2, borderWidth: 1, borderColor: colors.line, padding: 16, alignItems: 'center' },
  quickLabel: { fontFamily: fonts.jpBody, fontSize: 12, color: colors.text, letterSpacing: 0.5 },
});
