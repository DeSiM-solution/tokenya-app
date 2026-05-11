import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { colors, fonts } from '../constants/tokens';

interface Props {
  html: string;
  invoiceNo: string;
  onClose: () => void;
}

export default function InvoiceWebViewModal({ html, invoiceNo, onClose }: Props) {
  return (
    <Modal visible animationType="slide" presentationStyle="pageSheet">
      <View style={styles.root}>
        <View style={styles.bar}>
          <TouchableOpacity onPress={onClose} accessibilityLabel="閉じる">
            <Text style={styles.close}>✕ 閉じる</Text>
          </TouchableOpacity>
          <Text style={styles.title} numberOfLines={1}>{invoiceNo}</Text>
          <View style={{ width: 60 }} />
        </View>
        <WebView
          source={{ html }}
          originWhitelist={["*"]}
          javaScriptEnabled
          style={styles.web}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root:  { flex: 1, backgroundColor: colors.ink },
  bar:   {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  close: { fontFamily: fonts.jpBody, fontSize: 14, color: colors.vermilion },
  title: {
    fontFamily: fonts.mono,
    fontSize: 13,
    color: colors.text,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 12,
  },
  web:   { flex: 1, backgroundColor: '#fff' },
});
