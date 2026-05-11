import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { confirmPasswordReset } from '../../src/api/auth';
import { colors, fonts } from '../../src/constants/tokens';

export default function ResetPasswordScreen() {
  const [email, setEmail]       = useState('');
  const [token, setToken]       = useState('');
  const [error, setError]       = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading]   = useState(false);

  const handleReset = async () => {
    if (!email.trim()) { setError('メールアドレスを入力してください'); return; }
    if (!token.trim()) { setError('リセットコードを入力してください'); return; }
    setError('');
    setLoading(true);
    try {
      const pw = await confirmPasswordReset(email.trim(), token.trim());
      setNewPassword(pw);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'リセットに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  if (newPassword) {
    return (
      <View style={styles.root}>
        <View style={styles.inner}>
          <Text style={styles.logo}>
            トークン<Text style={styles.ya}>屋</Text>
          </Text>
          <Text style={styles.successTitle}>パスワードリセット完了</Text>
          <Text style={styles.desc}>新しいパスワードはこちらです。ログイン後すぐに変更することをお勧めします。</Text>
          <View style={styles.pwBox}>
            <Text style={styles.pwLabel}>新しいパスワード</Text>
            <Text style={styles.pwValue} selectable>{newPassword}</Text>
          </View>
          <TouchableOpacity style={styles.btn} onPress={() => router.replace('/(auth)/login')}>
            <Text style={styles.btnText}>ログイン画面へ →</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.root}
    >
      <ScrollView contentContainerStyle={styles.inner} keyboardShouldPersistTaps="handled">
        <Text style={styles.logo}>
          トークン<Text style={styles.ya}>屋</Text>
        </Text>
        <Text style={styles.sub}>リセットコードを入力</Text>
        <Text style={styles.desc}>
          メールに届いたリセットコードと登録メールアドレスを入力してください。
        </Text>

        <TextInput
          style={styles.input}
          placeholder="メールアドレス"
          placeholderTextColor={colors.textDim}
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="リセットコード"
          placeholderTextColor={colors.textDim}
          autoCapitalize="none"
          value={token}
          onChangeText={setToken}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity style={styles.btn} onPress={handleReset} disabled={loading}>
          {loading
            ? <ActivityIndicator color={colors.ink} />
            : <Text style={styles.btnText}>パスワードをリセット</Text>
          }
        </TouchableOpacity>

        <TouchableOpacity style={styles.link} onPress={() => router.replace('/(auth)/login')}>
          <Text style={styles.linkText}>← ログインに戻る</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root:         { flex: 1, backgroundColor: colors.ink },
  inner:        { flexGrow: 1, justifyContent: 'center', padding: 32 },
  logo:         { fontFamily: fonts.jpDisplay, fontSize: 40, fontWeight: '800', color: colors.text, textAlign: 'center', marginBottom: 8 },
  ya:           { color: colors.vermilion },
  sub:          { fontFamily: fonts.jpBody, fontSize: 13, color: colors.textMuted, textAlign: 'center', letterSpacing: 1, marginBottom: 12 },
  desc:         { fontFamily: fonts.jpBody, fontSize: 13, color: colors.textMuted, textAlign: 'center', lineHeight: 20, marginBottom: 32 },
  input:        { borderWidth: 1, borderColor: colors.lineStrong, backgroundColor: colors.ink2, color: colors.text, fontFamily: fonts.jpBody, fontSize: 15, padding: 14, marginBottom: 12 },
  error:        { fontFamily: fonts.jpBody, fontSize: 13, color: colors.vermilion, marginBottom: 12 },
  btn:          { backgroundColor: colors.vermilion, padding: 16, alignItems: 'center', marginTop: 8 },
  btnText:      { fontFamily: fonts.jpBody, fontSize: 15, fontWeight: '700', color: colors.ink, letterSpacing: 1 },
  link:         { alignItems: 'center', marginTop: 20 },
  linkText:     { fontFamily: fonts.jpBody, fontSize: 13, color: colors.textMuted },
  successTitle: { fontFamily: fonts.jpDisplay, fontSize: 22, fontWeight: '700', color: colors.text, textAlign: 'center', marginBottom: 16 },
  pwBox:        { borderWidth: 1, borderColor: colors.cyan, backgroundColor: colors.ink2, padding: 20, marginBottom: 28, alignItems: 'center' },
  pwLabel:      { fontFamily: fonts.mono, fontSize: 10, color: colors.cyan, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 },
  pwValue:      { fontFamily: fonts.mono, fontSize: 18, color: colors.text, letterSpacing: 1 },
});
