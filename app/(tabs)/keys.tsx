import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import { listKeys, deleteKey, type ApiKey } from '../../src/api/keys';
import KeyCard from '../../src/components/KeyCard';
import { colors, fonts, radii } from '../../src/constants/tokens';
import { formatJPY } from '../../src/utils/format';

export default function KeysScreen() {
  const [keys, setKeys]       = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try { setKeys(await listKeys()); } finally { setLoading(false); }
  };

  useFocusEffect(useCallback(() => { load(); }, []));

  const handleDelete = async (id: number) => {
    try {
      await deleteKey(id);
      await load();
    } catch {
      Alert.alert('エラー', 'APIキーを削除できませんでした。もう一度お試しください。');
    }
  };

  const active   = keys.filter(k => k.status !== 0);
  const inactive = keys.filter(k => k.status === 0);
  const monthTotal = active.reduce((s, k) => s + (k.month_jpy ?? 0), 0);

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.title}>APIキー</Text>
        <TouchableOpacity style={styles.newBtn} onPress={() => router.push('/modals/new-key')}>
          <Text style={styles.newBtnTxt}>＋ 新規作成</Text>
        </TouchableOpacity>
      </View>
      {loading
        ? <ActivityIndicator color={colors.vermilion} style={{ marginTop: 40 }} />
        : (
          <ScrollView contentContainerStyle={styles.list}>
            {keys.length === 0 ? (
              <Text style={styles.empty}>APIキーがまだありません</Text>
            ) : (
              <>
                {/* Active section */}
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>{`アクティブ（${active.length}）`}</Text>
                  <Text style={styles.sectionTotal}>合計 {formatJPY(monthTotal)} / 今月</Text>
                </View>
                {active.map((k) => (
                  <KeyCard key={k.id} apiKey={k} onDelete={handleDelete} />
                ))}

                {/* Inactive section */}
                {inactive.length > 0 && (
                  <>
                    <View style={[styles.sectionHeader, styles.sectionHeaderInactive]}>
                      <Text style={styles.sectionTitle}>{`無効（${inactive.length}）`}</Text>
                    </View>
                    {inactive.map((k) => (
                      <KeyCard key={k.id} apiKey={k} onDelete={handleDelete} />
                    ))}
                  </>
                )}
              </>
            )}
          </ScrollView>
        )
      }
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root:                  { flex: 1, backgroundColor: colors.ink },
  header:                { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
  title:                 { fontFamily: fonts.jpDisplay, fontSize: 24, fontWeight: '700', color: colors.text },
  newBtn:                { backgroundColor: colors.vermilion, borderRadius: radii.button, paddingHorizontal: 14, paddingVertical: 8 },
  newBtnTxt:             { fontFamily: fonts.jpBody, fontSize: 13, fontWeight: '700', color: colors.ink },
  list:                  { padding: 20, paddingTop: 0 },
  empty:                 { fontFamily: fonts.jpBody, fontSize: 14, color: colors.textMuted, textAlign: 'center', marginTop: 40 },
  sectionHeader:         { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionHeaderInactive: { marginTop: 8 },
  sectionTitle:          { fontFamily: fonts.jpBody, fontSize: 13, fontWeight: '600', color: colors.textMuted },
  sectionTotal:          { fontFamily: fonts.mono, fontSize: 12, color: colors.cyan },
});
