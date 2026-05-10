import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts } from '../constants/tokens';
import type { Tier } from '../store/balance';

const TIER_COLORS: Record<Tier, string> = {
  Bronze: '#C97D5C',
  Silver: '#C0C7D6',
  Gold:   colors.gold,
};

export default function TierBadge({ tier }: { tier: Tier }) {
  const c = TIER_COLORS[tier];
  return (
    <View style={[styles.badge, { borderColor: c, backgroundColor: c + '1A' }]}>
      <Text style={[styles.text, { color: c }]}>◆ {tier}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, alignSelf: 'flex-start' },
  text:  { fontFamily: fonts.mono, fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: '700' },
});
