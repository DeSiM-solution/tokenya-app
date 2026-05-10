import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getUsageSummary, type ModelUsage } from '../../src/api/usage';
import { colors, fonts, radii } from '../../src/constants/tokens';
import { formatJPY, formatTokens } from '../../src/utils/format';

export default function UsageScreen() {
  const [byModel, setByModel]           = useState<ModelUsage[]>([]);
  const [totalTokens, setTotalTokens]   = useState(0);
  const [totalCostJPY, setTotalCostJPY] = useState(0);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const d = await getUsageSummary();
        setByModel(d.byModel);
        setTotalTokens(d.totalTokens);
        setTotalCostJPY(d.totalCostJPY);
      } catch {
        setError('データの取得に失敗しました。');
      } finally { setLoading(false); }
    })();
  }, []);

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>使用状況</Text>

        <View style={styles.totalsRow}>
          <View style={styles.totalCard}>
            <Text style={styles.totalLabel}>合計トークン</Text>
            <Text style={styles.totalValue}>{loading ? '—' : formatTokens(totalTokens)}</Text>
          </View>
          <View style={styles.totalCard}>
            <Text style={styles.totalLabel}>合計費用</Text>
            <Text style={styles.totalValue}>{loading ? '—' : formatJPY(totalCostJPY)}</Text>
          </View>
        </View>

        <Text style={styles.sectionH}>モデル別</Text>
        {error && <Text style={styles.errorText}>{error}</Text>}
        {loading
          ? <ActivityIndicator color={colors.vermilion} />
          : (
            <View style={styles.list}>
              {byModel.length === 0
                ? <Text style={styles.empty}>使用データがありません</Text>
                : byModel.map((item) => (
                    <View key={item.model} style={styles.modelRow}>
                      <Text style={styles.modelName}>{item.model}</Text>
                      <View style={styles.modelRight}>
                        <Text style={styles.modelTokens}>{formatTokens(item.tokens)} tok</Text>
                        <Text style={styles.modelCost}>{formatJPY(item.costJPY)}</Text>
                      </View>
                    </View>
                  ))
              }
            </View>
          )
        }
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root:        { flex: 1, backgroundColor: colors.ink },
  content:     { padding: 20, paddingBottom: 100 },
  title:       { fontFamily: fonts.jpDisplay, fontSize: 24, fontWeight: '700', color: colors.text, marginBottom: 24 },
  totalsRow:   { flexDirection: 'row', gap: 12, marginBottom: 28 },
  totalCard:   { flex: 1, backgroundColor: colors.ink2, borderWidth: 1, borderColor: colors.line, borderRadius: radii.card, padding: 16 },
  totalLabel:  { fontFamily: fonts.mono, fontSize: 10, color: colors.textDim, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 },
  totalValue:  { fontFamily: fonts.jpDisplay, fontSize: 22, fontWeight: '700', color: colors.text },
  sectionH:    { fontFamily: fonts.mono, fontSize: 10, letterSpacing: 2.5, textTransform: 'uppercase', color: colors.textDim, marginBottom: 14 },
  list:        { backgroundColor: colors.ink2, borderWidth: 1, borderColor: colors.line, borderRadius: radii.card },
  modelRow:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14, borderBottomWidth: 1, borderBottomColor: colors.line },
  modelName:   { fontFamily: fonts.mono, fontSize: 13, color: colors.text, fontStyle: 'italic' },
  modelRight:  { alignItems: 'flex-end' },
  modelTokens: { fontFamily: fonts.mono, fontSize: 11, color: colors.textMuted },
  modelCost:   { fontFamily: fonts.mono, fontSize: 13, color: colors.vermilion, marginTop: 2 },
  empty:       { fontFamily: fonts.jpBody, fontSize: 14, color: colors.textMuted, textAlign: 'center', padding: 40 },
  errorText:   { fontFamily: fonts.jpBody, fontSize: 13, color: colors.vermilion, textAlign: 'center', marginTop: 20 },
});
