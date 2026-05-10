import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useBalanceStore } from '../../src/store/balance';
import AmountPicker from '../../src/components/AmountPicker';
import WebViewModal from '../../src/components/WebViewModal';
import { createTopUpOrder } from '../../src/api/balance';
import { colors, fonts, radii } from '../../src/constants/tokens';

const AMOUNTS = [1000, 3000, 5000, 10000, 30000, 50000];

export default function ChargeScreen() {
  const [selected, setSelected]       = useState(3000);
  const [loading, setLoading]         = useState(false);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const { balanceJPY } = useBalanceStore();

  const handleCharge = async () => {
    setLoading(true);
    try {
      const { checkout_url } = await createTopUpOrder(selected);
      setCheckoutUrl(checkout_url);
    } catch {
      Alert.alert('エラー', 'チャージを開始できませんでした。もう一度お試しください。');
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    setCheckoutUrl(null);
    router.push('/modals/payment-success');
  };

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.content}>
        <Text style={styles.title}>クレジット追加</Text>

        <View style={styles.balanceRow}>
          <Text style={styles.balanceLabel}>現在の残高</Text>
          <Text style={styles.balanceAmt}>¥{balanceJPY.toLocaleString('ja-JP')}</Text>
        </View>

        <Text style={styles.sectionH}>金額を選択</Text>
        <AmountPicker amounts={AMOUNTS} selected={selected} onSelect={setSelected} />

        <Text style={styles.payNote}>
          クレジットカード · コンビニ払い · 銀行振込（KOMOJU）
        </Text>

        <TouchableOpacity
          style={[styles.btn, loading && styles.btnDisabled]}
          onPress={handleCharge}
          disabled={loading}
        >
          <Text style={styles.btnText}>
            {loading ? '処理中...' : `¥${selected.toLocaleString('ja-JP')} をチャージ`}
          </Text>
        </TouchableOpacity>
      </View>

      {checkoutUrl && (
        <WebViewModal
          url={checkoutUrl}
          onClose={() => setCheckoutUrl(null)}
          onSuccess={handleSuccess}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root:        { flex: 1, backgroundColor: colors.ink },
  content:     { flex: 1, padding: 20 },
  title:       { fontFamily: fonts.jpDisplay, fontSize: 24, fontWeight: '700', color: colors.text, marginBottom: 24 },
  balanceRow:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', padding: 14, backgroundColor: colors.ink2, borderWidth: 1, borderColor: colors.line, borderRadius: radii.card, marginBottom: 24 },
  balanceLabel:{ fontFamily: fonts.mono, fontSize: 11, color: colors.textDim, letterSpacing: 1.5, textTransform: 'uppercase' },
  balanceAmt:  { fontFamily: fonts.jpDisplay, fontSize: 20, fontWeight: '700', color: colors.text },
  sectionH:    { fontFamily: fonts.mono, fontSize: 10, letterSpacing: 2.5, textTransform: 'uppercase', color: colors.textDim, marginBottom: 14 },
  payNote:     { fontFamily: fonts.jpBody, fontSize: 12, color: colors.textMuted, marginTop: 16, marginBottom: 24, textAlign: 'center' },
  btn:         { backgroundColor: colors.vermilion, borderRadius: radii.button, padding: 16, alignItems: 'center', marginTop: 'auto' },
  btnDisabled: { opacity: 0.6 },
  btnText:     { fontFamily: fonts.jpBody, fontSize: 15, fontWeight: '700', color: colors.ink, letterSpacing: 0.5 },
});
