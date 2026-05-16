import React from 'react';
import { View, Text, Pressable, Linking, StyleSheet } from 'react-native';
import { colors, fonts, radii, spacing } from '../../constants/tokens';

export interface NotYetAvailableCardProps {
  label: string;
  reason?: string;
  cta?: { text: string; href: string };
}

export function NotYetAvailableCard({ label, reason, cta }: NotYetAvailableCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.badge}>近日対応</Text>
      {reason && <Text style={styles.reason}>{reason}</Text>}
      {cta && (
        <Pressable onPress={() => Linking.openURL(cta.href)}>
          <Text style={styles.cta}>{cta.text}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.line,
  },
  label: {
    color: colors.textMuted,
    fontFamily: fonts.body,
    fontSize: 12,
    letterSpacing: 1,
    marginBottom: 8,
  },
  badge: {
    color: colors.gold,
    fontFamily: fonts.jpBody,
    fontSize: 14,
    fontWeight: '700',
  },
  reason: {
    color: colors.textDim,
    fontFamily: fonts.jpBody,
    fontSize: 12,
    marginTop: 6,
  },
  cta: {
    color: colors.cyan,
    fontFamily: fonts.body,
    fontSize: 13,
    marginTop: 12,
  },
});
