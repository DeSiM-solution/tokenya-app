import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { colors, fonts } from '../constants/tokens';

interface Props {
  url:       string;
  onClose:   () => void;
  onSuccess: () => void;
}

const SUCCESS_PATTERN = /tokenya\.ai.*success|payment.*complete|topup.*success/i;

export default function WebViewModal({ url, onClose, onSuccess }: Props) {
  return (
    <Modal visible animationType="slide" presentationStyle="pageSheet">
      <View style={styles.root}>
        <View style={styles.bar}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.close}>✕ 閉じる</Text>
          </TouchableOpacity>
          <Text style={styles.title}>お支払い</Text>
          <View style={{ width: 60 }} />
        </View>
        <WebView
          source={{ uri: url }}
          style={styles.web}
          onNavigationStateChange={(state) => {
            if (SUCCESS_PATTERN.test(state.url)) onSuccess();
          }}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root:  { flex: 1, backgroundColor: colors.ink },
  bar:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: colors.line },
  close: { fontFamily: fonts.jpBody, fontSize: 14, color: colors.vermilion },
  title: { fontFamily: fonts.jpDisplay, fontSize: 16, fontWeight: '700', color: colors.text },
  web:   { flex: 1 },
});
