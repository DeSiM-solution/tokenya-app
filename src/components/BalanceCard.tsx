import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, fonts, radii } from '../constants/tokens';
import TierBadge from './TierBadge';
import type { Tier } from '../store/balance';

interface Props {
  balanceJPY: number;
  tier: Tier;
  onCharge: () => void;
}

export default function BalanceCard({ balanceJPY, tier, onCharge }: Props) {
  const formatted = Math.round(balanceJPY).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return (
    <View style={styles.card}>
      <View style={styles.top}>
        <Text style={styles.label}>残高</Text>
        <TierBadge tier={tier} />
      </View>
      <View style={styles.amountRow}>
        <Text style={styles.yen}>¥</Text>
        <Text style={styles.amount}>{formatted}</Text>
      </View>
      <Text style={styles.sub}>いつでも使える · 税込み</Text>
      <TouchableOpacity style={styles.cta} onPress={onCharge}>
        <Text style={styles.ctaText}>クレジットを追加</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card:    { backgroundColor: colors.ink2, borderWidth: 1, borderColor: colors.line, borderRadius: radii.card, padding: 24, marginTop: 14 },
  top:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  label:   { fontFamily: fonts.mono, fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: colors.textDim },
  amountRow: { flexDirection: 'row', alignItems: 'baseline', marginBottom: 4 },
  amount:  { fontFamily: fonts.jpDisplay, fontSize: 56, fontWeight: '800', color: colors.text, lineHeight: 60, letterSpacing: -1 },
  yen:     { fontSize: 30, color: colors.vermilion, fontFamily: fonts.jpDisplay, fontWeight: '800', lineHeight: 60 },
  sub:     { fontFamily: fonts.mono, fontSize: 11, color: colors.textDim, letterSpacing: 0.5, marginBottom: 22 },
  cta:     { backgroundColor: colors.vermilion, borderRadius: radii.button, padding: 14, alignItems: 'center' },
  ctaText: { fontFamily: fonts.jpBody, fontSize: 14, fontWeight: '700', color: colors.ink, letterSpacing: 0.5 },
});
