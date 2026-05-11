import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native';
import { router } from 'expo-router';
import { loginUser, getSelfInfo } from '../../src/api/auth';
import { secureStore } from '../../src/utils/secure-store';
import { useAuthStore } from '../../src/store/auth';
import { colors, fonts } from '../../src/constants/tokens';

export default function LoginScreen() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const setAuth = useAuthStore((s) => s.setAuth);

  const handleLogin = async () => {
    if (!email.trim()) { setError('メールアドレスを入力してください'); return; }
    if (!password.trim()) { setError('パスワードを入力してください'); return; }
    setError('');
    setLoading(true);
    try {
      const token = await loginUser(email.trim(), password);
      await secureStore.setToken(token);
      const user = await getSelfInfo();
      setAuth(token, { username: user.username, email: user.email });
      router.replace('/(tabs)/');
    } catch {
      setError('メールアドレスまたはパスワードが正しくありません');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.root}
    >
      <View style={styles.inner}>
        <Text style={styles.logo}>
          トークン<Text style={styles.ya}>屋</Text>
        </Text>
        <Text style={styles.sub}>AI トークン コンシェルジュ</Text>

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

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity
          style={styles.btn}
          onPress={handleLogin}
          disabled={loading}
          testID="login-button"
        >
          {loading
            ? <ActivityIndicator color={colors.ink} />
            : <Text style={styles.btnText}>ログイン</Text>
          }
        </TouchableOpacity>

        <TouchableOpacity style={styles.link} onPress={() => router.push('/(auth)/forgot-password')}>
          <Text style={styles.linkText}>パスワードをお忘れですか？</Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity style={styles.registerBtn} onPress={() => router.push('/(auth)/register')}>
          <Text style={styles.registerText}>新規登録 →</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root:        { flex: 1, backgroundColor: colors.ink },
  inner:       { flex: 1, justifyContent: 'center', padding: 32 },
  logo:        { fontFamily: fonts.jpDisplay, fontSize: 40, fontWeight: '800', color: colors.text, textAlign: 'center', marginBottom: 8 },
  ya:          { color: colors.vermilion },
  sub:         { fontFamily: fonts.jpBody, fontSize: 13, color: colors.textMuted, textAlign: 'center', letterSpacing: 1, marginBottom: 48 },
  input:       { borderWidth: 1, borderColor: colors.lineStrong, backgroundColor: colors.ink2, color: colors.text, fontFamily: fonts.jpBody, fontSize: 15, padding: 14, marginBottom: 12 },
  error:       { fontFamily: fonts.jpBody, fontSize: 13, color: colors.vermilion, marginBottom: 12 },
  btn:         { backgroundColor: colors.vermilion, padding: 16, alignItems: 'center', marginTop: 8 },
  btnText:     { fontFamily: fonts.jpBody, fontSize: 15, fontWeight: '700', color: colors.ink, letterSpacing: 1 },
  link:        { alignItems: 'center', marginTop: 20 },
  linkText:    { fontFamily: fonts.jpBody, fontSize: 13, color: colors.textMuted },
  divider:     { borderTopWidth: 1, borderTopColor: colors.line, marginVertical: 24 },
  registerBtn: { alignItems: 'center' },
  registerText:{ fontFamily: fonts.jpBody, fontSize: 14, fontWeight: '700', color: colors.vermilion, letterSpacing: 0.5 },
});
