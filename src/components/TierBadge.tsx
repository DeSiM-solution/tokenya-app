import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts } from '../constants/tokens';
import type { Tier } from '../store/balance';

const TIER_CONFIG: Record<Tier, { color: string; bg: string }> = {
  Bronze: { color: '#C97D5C', bg: 'rgba(201,125,92,0.10)' },
  Silver: { color: '#C0C7D6', bg: 'rgba(192,199,214,0.10)' },
  Gold:   { color: colors.gold, bg: 'rgba(212,168,87,0.10)' },
};

export default function TierBadge({ tier }: { tier: Tier }) {
  const { color, bg } = TIER_CONFIG[tier];
  return (
    <View style={[styles.badge, { borderColor: color, backgroundColor: bg }]}>
      <Text style={[styles.text, { color }]}>◆ {tier}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, alignSelf: 'flex-start' },
  text:  { fontFamily: fonts.mono, fontSize: 10, letterSpacing: 1.2, textTransform: 'uppercase', fontWeight: '700' },
});
