import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBalanceStore } from '../../src/store/balance';
import { useAuthStore } from '../../src/store/auth';
import { NotYetAvailableCard } from '../../src/components/coming-soon/NotYetAvailableCard';
import UsageCard from '../../src/components/UsageCard';
import ActivityList, { type Activity } from '../../src/components/ActivityList';
import { apiClient } from '../../src/api/client';
import { colors, fonts, radii } from '../../src/constants/tokens';

const QUOTA_PER_JPY = 500000 / 156.805154;

const QUICK = [
  { label: 'チャージ',   route: '/(tabs)/charge'   },
  { label: 'APIキー',   route: '/(tabs)/keys'     },
  { label: '使用状況',  route: '/(tabs)/usage'    },
  { label: '請求書',    route: '/(tabs)/invoices' },
] as const;

export default function HomeScreen() {
  const { usedTokens, totalTokens, refresh } = useBalanceStore();
  const { user } = useAuthStore();
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    refresh();
    fetchRecentActivity();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchRecentActivity = async () => {
    try {
      const res = await apiClient.get('/api/log/self', { params: { p: 1, page_size: 5 } });
      const items = res.data?.data?.items ?? [];
      setActivities(
        items.map((item: { id: number; model_name: string; prompt_tokens: number; completion_tokens: number; quota: number; created_at: number }) => ({
          id: item.id,
          model: item.model_name,
          tokens: (item.prompt_tokens ?? 0) + (item.completion_tokens ?? 0),
          costJPY: Math.round((item.quota ?? 0) / QUOTA_PER_JPY),
          createdAt: item.created_at,
        }))
      );
    } catch {
      // silent — leave empty list on error
    }
  };

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

        <NotYetAvailableCard
          label="残高"
          reason="JPY 換算は近日対応"
        />
        <UsageCard usedTokens={usedTokens} totalTokens={totalTokens} />

        <Text style={styles.sectionH}>クイックアクション</Text>
        <View style={styles.quickGrid}>
          {QUICK.map((a) => (
            <TouchableOpacity key={a.label} style={styles.quickItem} onPress={() => router.push(a.route)}>
              <Text style={styles.quickLabel}>{a.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionH}>最近のリクエスト</Text>
        <ActivityList items={activities} />
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
  avatar:     { width: 36, height: 36, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.lineStrong, borderRadius: radii.sm, alignItems: 'center', justifyContent: 'center' },
  avatarTxt:  { fontFamily: fonts.jpDisplay, fontSize: 14, fontWeight: '700', color: colors.text },
  sectionH:   { fontFamily: fonts.mono, fontSize: 10, letterSpacing: 2.5, textTransform: 'uppercase', color: colors.textDim, marginTop: 28, marginBottom: 14 },
  quickGrid:  { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  quickItem:  { flex: 1, minWidth: '40%', backgroundColor: colors.ink2, borderWidth: 1, borderColor: colors.line, borderRadius: radii.button, padding: 16, alignItems: 'center' },
  quickLabel: { fontFamily: fonts.jpBody, fontSize: 12, color: colors.text, letterSpacing: 0.5 },
});
