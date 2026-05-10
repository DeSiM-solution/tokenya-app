import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAuthStore } from '../src/store/auth';
import { secureStore } from '../src/utils/secure-store';
import { colors, fonts, radii } from '../src/constants/tokens';

export default function SettingsScreen() {
  const { user, clearAuth } = useAuthStore();

  const handleLogout = () => {
    Alert.alert(
      'ログアウト',
      'ログアウトしますか？',
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: 'ログアウト',
          style: 'destructive',
          onPress: async () => {
            await secureStore.clearToken();
            clearAuth();
            router.replace('/(auth)/login');
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backTxt}>← 戻る</Text>
        </TouchableOpacity>
        <Text style={styles.title}>設定</Text>
        <View style={{ width: 60 }} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionH}>アカウント</Text>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>ユーザー名</Text>
          <Text style={styles.rowValue}>{user?.username ?? '—'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>メールアドレス</Text>
          <Text style={styles.rowValue}>{user?.email ?? '—'}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionH}>アプリについて</Text>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>バージョン</Text>
          <Text style={styles.rowValue}>1.0.0</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>AGPL-3.0 ソースコード</Text>
          <Text style={[styles.rowValue, { color: colors.cyan }]}>GitHub</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutTxt}>ログアウト</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root:      { flex: 1, backgroundColor: colors.ink },
  header:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  backTxt:   { fontFamily: fonts.jpBody, fontSize: 14, color: colors.vermilion, width: 60 },
  title:     { fontFamily: fonts.jpDisplay, fontSize: 20, fontWeight: '700', color: colors.text },
  section:   { marginTop: 24, paddingHorizontal: 20 },
  sectionH:  { fontFamily: fonts.mono, fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: colors.textDim, marginBottom: 12 },
  row:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.line },
  rowLabel:  { fontFamily: fonts.jpBody, fontSize: 14, color: colors.text },
  rowValue:  { fontFamily: fonts.mono, fontSize: 13, color: colors.textMuted },
  footer:    { position: 'absolute', bottom: 40, left: 20, right: 20 },
  logoutBtn: { borderWidth: 1, borderColor: colors.vermilion, borderRadius: radii.button, padding: 16, alignItems: 'center' },
  logoutTxt: { fontFamily: fonts.jpBody, fontSize: 14, color: colors.vermilion, fontWeight: '700' },
});
