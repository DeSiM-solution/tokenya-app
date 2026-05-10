import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useBalanceStore } from '../../src/store/balance';
import { colors, fonts, radii } from '../../src/constants/tokens';

export default function PaymentSuccessModal() {
  const { refresh } = useBalanceStore();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { refresh(); }, []);

  return (
    <View style={styles.root}>
      <Text style={styles.check}>✓</Text>
      <Text style={styles.title}>チャージ完了</Text>
      <Text style={styles.sub}>残高に反映されました</Text>
      <TouchableOpacity style={styles.btn} onPress={() => router.replace('/(tabs)/')}>
        <Text style={styles.btnText}>ホームへ戻る</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  root:    { flex: 1, backgroundColor: colors.ink, justifyContent: 'center', alignItems: 'center', padding: 32 },
  check:   { fontSize: 64, color: colors.success, marginBottom: 24 },
  title:   { fontFamily: fonts.jpDisplay, fontSize: 32, fontWeight: '800', color: colors.text, marginBottom: 12 },
  sub:     { fontFamily: fonts.jpBody, fontSize: 16, color: colors.textMuted, marginBottom: 48 },
  btn:     { backgroundColor: colors.vermilion, borderRadius: radii.button, paddingHorizontal: 40, paddingVertical: 16 },
  btnText: { fontFamily: fonts.jpBody, fontSize: 15, fontWeight: '700', color: colors.ink, letterSpacing: 0.5 },
});
