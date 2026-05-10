import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts } from '../constants/tokens';
import { formatTokens } from '../utils/format';

interface Props { usedTokens: number; totalTokens: number }

export default function UsageCard({ usedTokens, totalTokens }: Props) {
  const pct = totalTokens > 0 ? usedTokens / totalTokens : 0;
  return (
    <View style={styles.card}>
      <View style={styles.top}>
        <Text style={styles.amount}>
          {formatTokens(usedTokens)}
          <Text style={styles.of}> / {formatTokens(totalTokens)}</Text>
        </Text>
        <Text style={styles.pct}>{Math.round(pct * 100)}%</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${Math.min(pct * 100, 100)}%` as `${number}%` }]} />
      </View>
      <Text style={styles.meta}>今月の使用トークン</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card:   { backgroundColor: colors.ink2, borderWidth: 1, borderColor: colors.line, padding: 18, marginTop: 14 },
  top:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 },
  amount: { fontFamily: fonts.jpDisplay, fontSize: 24, fontWeight: '700', color: colors.text },
  of:     { fontFamily: fonts.mono, fontSize: 13, color: colors.textDim, fontWeight: '400' },
  pct:    { fontFamily: fonts.mono, fontSize: 12, color: colors.cyan },
  track:  { height: 6, backgroundColor: colors.ink3, overflow: 'hidden', marginBottom: 12 },
  fill:   { height: '100%', backgroundColor: colors.vermilion },
  meta:   { fontFamily: fonts.jpBody, fontSize: 12, color: colors.textMuted },
});
