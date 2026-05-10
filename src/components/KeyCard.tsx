import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { colors, fonts, radii } from '../constants/tokens';
import { formatDate } from '../utils/format';
import type { ApiKey } from '../api/keys';

interface Props { apiKey: ApiKey; onDelete: (id: number) => void }

export default function KeyCard({ apiKey, onDelete }: Props) {
  const [copied, setCopied] = useState(false);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleCopy = async () => {
    await Clipboard.setStringAsync(apiKey.key);
    setCopied(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  const handleDelete = () => {
    Alert.alert(
      'APIキーを削除',
      `「${apiKey.name}」を削除しますか？この操作は元に戻せません。`,
      [
        { text: 'キャンセル', style: 'cancel' },
        { text: '削除する', style: 'destructive', onPress: () => onDelete(apiKey.id) },
      ],
    );
  };

  // 先頭 11 文字（'sk-tokenya-' まで）+ マスク
  const masked = apiKey.key.slice(0, 11) + '••••••';

  return (
    <View style={styles.card}>
      <View style={styles.top}>
        <Text style={styles.name}>{apiKey.name}</Text>
        <TouchableOpacity onPress={handleDelete}>
          <Text style={styles.deleteTxt}>削除</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.key}>{masked}</Text>
      <View style={styles.bottom}>
        <Text style={styles.meta}>作成日 {formatDate(apiKey.created_at)}</Text>
        <TouchableOpacity onPress={handleCopy} style={styles.copyBtn}>
          <Text style={styles.copyTxt}>{copied ? 'コピー済み' : 'コピー'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card:      { backgroundColor: colors.ink2, borderWidth: 1, borderColor: colors.line, borderRadius: radii.card, padding: 16, marginBottom: 12 },
  top:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  name:      { fontFamily: fonts.jpBody, fontSize: 15, fontWeight: '500', color: colors.text },
  deleteTxt: { fontFamily: fonts.jpBody, fontSize: 12, color: colors.vermilion },
  key:       { fontFamily: fonts.mono, fontSize: 13, color: colors.textMuted, marginBottom: 12 },
  bottom:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  meta:      { fontFamily: fonts.mono, fontSize: 10, color: colors.textDim },
  copyBtn:   { paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: colors.lineStrong, borderRadius: radii.sm },
  copyTxt:   { fontFamily: fonts.jpBody, fontSize: 12, color: colors.text },
});
