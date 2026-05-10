import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { listInvoices, getInvoiceURL, type Invoice } from '../../src/api/invoices';
import { secureStore } from '../../src/utils/secure-store';
import InvoiceRow from '../../src/components/InvoiceRow';
import { colors, fonts, radii } from '../../src/constants/tokens';

export default function InvoicesScreen() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try { setInvoices(await listInvoices()); } catch { setError('データの取得に失敗しました。'); } finally { setLoading(false); }
    })();
  }, []);

  const handleDownload = async (invoiceNo: string) => {
    const token = await secureStore.getToken();
    const url = getInvoiceURL(invoiceNo) + (token ? `?access_token=${token}` : '');
    await Linking.openURL(url);
  };

  return (
    <SafeAreaView style={styles.root}>
      <Text style={styles.title}>適格請求書</Text>
      <Text style={styles.sub}>登録番号 T5011101087821</Text>
      {error && <Text style={styles.errorText}>{error}</Text>}
      {loading
        ? <ActivityIndicator color={colors.vermilion} style={{ marginTop: 40 }} />
        : (
          <ScrollView>
            <View style={styles.list}>
              {invoices.length === 0
                ? <Text style={styles.empty}>請求書がまだありません</Text>
                : invoices.map((inv) => (
                    <InvoiceRow
                      key={inv.invoice_no}
                      invoice={inv}
                      onDownload={handleDownload}
                    />
                  ))
              }
            </View>
          </ScrollView>
        )
      }
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root:  { flex: 1, backgroundColor: colors.ink },
  title: { fontFamily: fonts.jpDisplay, fontSize: 24, fontWeight: '700', color: colors.text, margin: 20, marginBottom: 4 },
  sub:   { fontFamily: fonts.mono, fontSize: 11, color: colors.textDim, letterSpacing: 1, marginHorizontal: 20, marginBottom: 20 },
  list:  { backgroundColor: colors.ink2, borderWidth: 1, borderColor: colors.line, borderRadius: radii.card, marginHorizontal: 20 },
  empty:     { fontFamily: fonts.jpBody, fontSize: 14, color: colors.textMuted, textAlign: 'center', padding: 40 },
  errorText: { fontFamily: fonts.jpBody, fontSize: 13, color: colors.vermilion, textAlign: 'center', margin: 20 },
});
