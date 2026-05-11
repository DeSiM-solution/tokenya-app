import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { registerUser } from '../../src/api/auth';
import { colors, fonts } from '../../src/constants/tokens';

export default function RegisterScreen() {
  const [username, setUsername] = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm]   = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const handleRegister = async () => {
    if (!username.trim()) { setError('ユーザー名を入力してください'); return; }
    if (!email.trim())    { setError('メールアドレスを入力してください'); return; }
    if (!password.trim()) { setError('パスワードを入力してください'); return; }
    if (password !== confirm) { setError('パスワードが一致しません'); return; }
    setError('');
    setLoading(true);
    try {
      await registerUser(username.trim(), email.trim(), password);
      router.replace('/(auth)/login');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : '登録に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.root}
    >
      <ScrollView contentContainerStyle={styles.inner} keyboardShouldPersistTaps="handled">
        <Text style={styles.logo}>
          トークン<Text style={styles.ya}>屋</Text>
        </Text>
        <Text style={styles.sub}>新規アカウント登録</Text>

        <TextInput
          style={styles.input}
          placeholder="ユーザー名"
          placeholderTextColor={colors.textDim}
          autoCapitalize="none"
          value={username}
          onChangeText={setUsername}
        />
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
          placeholder="パスワード"
          placeholderTextColor={colors.textDim}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="パスワード（確認）"
          placeholderTextColor={colors.textDim}
          secureTextEntry
          value={confirm}
          onChangeText={setConfirm}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <View style={styles.bonus}>
          <Text style={styles.bonusTitle}>◆ 新規登録特典</Text>
          <Text style={styles.bonusText}>¥1,000 分のクレジットを自動付与。クレジットカード登録は不要です。</Text>
        </View>

        <TouchableOpacity
          style={styles.btn}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading
            ? <ActivityIndicator color={colors.ink} />
            : <Text style={styles.btnText}>登録する</Text>
          }
        </TouchableOpacity>

        <TouchableOpacity style={styles.link} onPress={() => router.back()}>
          <Text style={styles.linkText}>← ログインに戻る</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root:       { flex: 1, backgroundColor: colors.ink },
  inner:      { flexGrow: 1, justifyContent: 'center', padding: 32 },
  logo:       { fontFamily: fonts.jpDisplay, fontSize: 40, fontWeight: '800', color: colors.text, textAlign: 'center', marginBottom: 8 },
  ya:         { color: colors.vermilion },
  sub:        { fontFamily: fonts.jpBody, fontSize: 13, color: colors.textMuted, textAlign: 'center', letterSpacing: 1, marginBottom: 36 },
  input:      { borderWidth: 1, borderColor: colors.lineStrong, backgroundColor: colors.ink2, color: colors.text, fontFamily: fonts.jpBody, fontSize: 15, padding: 14, marginBottom: 12 },
  error:      { fontFamily: fonts.jpBody, fontSize: 13, color: colors.vermilion, marginBottom: 12 },
  bonus:      { borderLeftWidth: 2, borderLeftColor: colors.cyan, backgroundColor: colors.ink2, padding: 14, marginBottom: 20 },
  bonusTitle: { fontFamily: fonts.jpBody, fontSize: 12, fontWeight: '700', color: colors.cyan, marginBottom: 4 },
  bonusText:  { fontFamily: fonts.jpBody, fontSize: 12, color: colors.textMuted, lineHeight: 18 },
  btn:        { backgroundColor: colors.vermilion, padding: 16, alignItems: 'center', marginTop: 4 },
  btnText:    { fontFamily: fonts.jpBody, fontSize: 15, fontWeight: '700', color: colors.ink, letterSpacing: 1 },
  link:       { alignItems: 'center', marginTop: 20 },
  linkText:   { fontFamily: fonts.jpBody, fontSize: 13, color: colors.textMuted },
});
