import React from 'react';
import { View, Text, Pressable, Linking, StyleSheet } from 'react-native';
import { colors, fonts, spacing } from '../../constants/tokens';

export interface NotYetAvailableScreenProps {
  label: string;
  reason?: string;
  cta?: { text: string; href: string };
}

export function NotYetAvailableScreen({ label, reason, cta }: NotYetAvailableScreenProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.headline}>近日対応</Text>
      {reason && <Text style={styles.reason}>{reason}</Text>}
      {cta && (
        <Pressable onPress={() => Linking.openURL(cta.href)} style={styles.ctaWrap}>
          <Text style={styles.cta}>{cta.text}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  label: {
    color: colors.textMuted,
    fontFamily: fonts.body,
    fontSize: 13,
    letterSpacing: 2,
    marginBottom: 16,
    textTransform: 'uppercase',
  },
  headline: {
    color: colors.gold,
    fontFamily: fonts.jpDisplay,
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 16,
  },
  reason: {
    color: colors.textDim,
    fontFamily: fonts.jpBody,
    fontSize: 14,
    textAlign: 'center',
    maxWidth: 320,
    marginBottom: 32,
  },
  ctaWrap: { padding: spacing.md },
  cta: {
    color: colors.cyan,
    fontFamily: fonts.body,
    fontSize: 15,
  },
});
