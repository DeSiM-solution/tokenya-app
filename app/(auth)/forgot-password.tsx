import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native';
import { router } from 'expo-router';
import { sendPasswordResetEmail } from '../../src/api/auth';
import { colors, fonts } from '../../src/constants/tokens';

export default function ForgotPasswordScreen() {
  const [email, setEmail]     = useState('');
  const [error, setError]     = useState('');
  const [sent, setSent]       = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!email.trim()) { setError('メールアドレスを入力してください'); return; }
    setError('');
    setLoading(true);
    try {
      await sendPasswordResetEmail(email.trim());
      setSent(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : '送信に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <View style={styles.root}>
        <View style={styles.inner}>
          <Text style={styles.logo}>
            トークン<Text style={styles.ya}>屋</Text>
          </Text>
          <Text style={styles.successTitle}>メールを送信しました</Text>
          <Text style={styles.successText}>
            パスワードリセット用のリンクを{'\n'}{email}{'\n'}に送信しました。メールをご確認ください。
          </Text>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => router.push('/(auth)/reset-password')}
          >
            <Text style={styles.btnText}>リセットコードを入力する →</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.link} onPress={() => router.back()}>
            <Text style={styles.linkText}>← ログインに戻る</Text>
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
      <View style={styles.inner}>
        <Text style={styles.logo}>
          トークン<Text style={styles.ya}>屋</Text>
        </Text>
        <Text style={styles.sub}>パスワードをリセット</Text>
        <Text style={styles.desc}>
          登録済みのメールアドレスを入力してください。リセット用のリンクをお送りします。
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

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity style={styles.btn} onPress={handleSend} disabled={loading}>
          {loading
            ? <ActivityIndicator color={colors.ink} />
            : <Text style={styles.btnText}>リセットメールを送信</Text>
          }
        </TouchableOpacity>

        <TouchableOpacity style={styles.link} onPress={() => router.back()}>
          <Text style={styles.linkText}>← ログインに戻る</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root:         { flex: 1, backgroundColor: colors.ink },
  inner:        { flex: 1, justifyContent: 'center', padding: 32 },
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
  successText:  { fontFamily: fonts.jpBody, fontSize: 14, color: colors.textMuted, textAlign: 'center', lineHeight: 22, marginBottom: 32 },
});
