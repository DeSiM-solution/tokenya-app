import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, fonts, radii } from '../constants/tokens';
import { formatJPY, formatDate } from '../utils/format';
import type { Invoice } from '../api/invoices';

interface Props { invoice: Invoice; onDownload: (no: string) => void }

export default function InvoiceRow({ invoice, onDownload }: Props) {
  return (
    <View style={styles.row}>
      <View>
        <Text style={styles.no}>{invoice.invoice_no}</Text>
        <Text style={styles.date}>{formatDate(invoice.issued_at)}</Text>
      </View>
      <View style={styles.right}>
        <Text style={styles.amount}>{formatJPY(invoice.total_jpy)}</Text>
        <TouchableOpacity style={styles.dlBtn} onPress={() => onDownload(invoice.invoice_no)}>
          <Text style={styles.dlTxt}>ダウンロード</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14, borderBottomWidth: 1, borderBottomColor: colors.line },
  no:     { fontFamily: fonts.mono, fontSize: 13, color: colors.text },
  date:   { fontFamily: fonts.mono, fontSize: 10, color: colors.textDim, marginTop: 4 },
  right:  { alignItems: 'flex-end' },
  amount: { fontFamily: fonts.jpDisplay, fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: 6 },
  dlBtn:  { paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1, borderColor: colors.lineStrong, borderRadius: radii.sm },
  dlTxt:  { fontFamily: fonts.jpBody, fontSize: 11, color: colors.textMuted },
});
