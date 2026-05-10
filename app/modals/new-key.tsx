import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { createKey } from '../../src/api/keys';
import { colors, fonts, radii } from '../../src/constants/tokens';

export default function NewKeyModal() {
  const [name, setName]       = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) { Alert.alert('エラー', 'キー名を入力してください'); return; }
    setLoading(true);
    try {
      await createKey(name.trim(), []);
      router.back();
    } catch {
      Alert.alert('エラー', 'APIキーを作成できませんでした。もう一度お試しください。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.content}>
        <Text style={styles.title}>新規APIキー</Text>
        <Text style={styles.label}>キー名</Text>
        <TextInput
          style={styles.input}
          placeholder="例: 開発用、本番用"
          placeholderTextColor={colors.textDim}
          value={name}
          onChangeText={setName}
          autoFocus
        />
        <TouchableOpacity
          style={[styles.btn, loading && styles.btnDisabled]}
          onPress={handleCreate}
          disabled={loading}
        >
          <Text style={styles.btnTxt}>{loading ? '作成中...' : '作成する'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelBtn} onPress={() => router.back()}>
          <Text style={styles.cancelTxt}>キャンセル</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root:       { flex: 1, backgroundColor: colors.ink },
  content:    { flex: 1, padding: 24 },
  title:      { fontFamily: fonts.jpDisplay, fontSize: 24, fontWeight: '700', color: colors.text, marginBottom: 32 },
  label:      { fontFamily: fonts.mono, fontSize: 11, color: colors.textDim, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 },
  input:      { borderWidth: 1, borderColor: colors.lineStrong, borderRadius: radii.sm, backgroundColor: colors.ink2, color: colors.text, fontFamily: fonts.jpBody, fontSize: 15, padding: 14, marginBottom: 24 },
  btn:        { backgroundColor: colors.vermilion, borderRadius: radii.button, padding: 16, alignItems: 'center', marginBottom: 12 },
  btnDisabled:{ opacity: 0.6 },
  btnTxt:     { fontFamily: fonts.jpBody, fontSize: 15, fontWeight: '700', color: colors.ink },
  cancelBtn:  { padding: 16, alignItems: 'center' },
  cancelTxt:  { fontFamily: fonts.jpBody, fontSize: 14, color: colors.textMuted },
});
