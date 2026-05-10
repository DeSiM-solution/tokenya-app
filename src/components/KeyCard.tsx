import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { colors, fonts, radii } from '../constants/tokens';
import { formatDate, formatJPY } from '../utils/format';
import type { ApiKey } from '../api/keys';

interface Props { apiKey: ApiKey; onDelete: (id: number) => void }

function formatRelativeTime(ts: number | null | undefined): string {
  if (ts == null) return '—';
  const diffSec = Math.floor(Date.now() / 1000 - ts);
  const mins  = Math.floor(diffSec / 60);
  if (mins < 60)  return `${mins}m前`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h前`;
  return `${Math.floor(hours / 24)}日前`;
}

export default function KeyCard({ apiKey, onDelete }: Props) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isActive = apiKey.status !== 0;

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

  const todayStr  = apiKey.today_jpy  != null ? formatJPY(apiKey.today_jpy)  : '—';
  const monthStr  = apiKey.month_jpy  != null ? formatJPY(apiKey.month_jpy)  : '—';
  const lastUsed  = formatRelativeTime(apiKey.last_used);

  return (
    <View style={[styles.card, !isActive && styles.cardInactive]}>
      {/* Top row: status dot + name | edit + trash */}
      <View style={styles.top}>
        <View style={styles.nameRow}>
          <View style={[styles.dot, { backgroundColor: isActive ? colors.success : colors.textDim }]} />
          <Text style={styles.name}>{apiKey.name}</Text>
        </View>
        {isActive && (
          <TouchableOpacity onPress={handleDelete}>
            <Text style={styles.deleteTxt}>削除</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Masked key */}
      <Text style={styles.key}>{masked}</Text>

      {/* Stats row — active only */}
      {isActive && (
        <View style={styles.statsRow}>
          <View style={styles.statCell}>
            <Text style={styles.statLabel}>今日</Text>
            <Text style={styles.statValue}>{todayStr}</Text>
          </View>
          <View style={styles.statCell}>
            <Text style={styles.statLabel}>今月</Text>
            <Text style={styles.statValue}>{monthStr}</Text>
          </View>
          <View style={styles.statCell}>
            <Text style={styles.statLabel}>最終</Text>
            <Text style={styles.statValue}>{lastUsed}</Text>
          </View>
        </View>
      )}

      {/* Bottom row: created date | copy — active only */}
      {isActive && (
        <View style={styles.bottom}>
          <Text style={styles.meta}>作成日 {formatDate(apiKey.created_at)}</Text>
          <TouchableOpacity onPress={handleCopy} style={styles.copyBtn}>
            <Text style={styles.copyTxt}>{copied ? 'コピー済み' : 'コピー'}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card:        { backgroundColor: colors.ink2, borderWidth: 1, borderColor: colors.line, borderRadius: radii.card, padding: 16, marginBottom: 12 },
  cardInactive:{ opacity: 0.55 },
  top:         { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  nameRow:     { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dot:         { width: 6, height: 6, borderRadius: 3 },
  name:        { fontFamily: fonts.jpBody, fontSize: 15, fontWeight: '500', color: colors.text },
  deleteTxt:   { fontFamily: fonts.jpBody, fontSize: 12, color: colors.vermilion },
  key:         { fontFamily: fonts.mono, fontSize: 13, color: colors.textMuted, marginBottom: 12 },
  statsRow:    { flexDirection: 'row', marginBottom: 12, gap: 16 },
  statCell:    { alignItems: 'flex-start' },
  statLabel:   { fontFamily: fonts.jpBody, fontSize: 10, color: colors.textDim, marginBottom: 2 },
  statValue:   { fontFamily: fonts.mono, fontSize: 12, color: colors.text },
  bottom:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  meta:        { fontFamily: fonts.mono, fontSize: 10, color: colors.textDim },
  copyBtn:     { paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: colors.lineStrong, borderRadius: radii.sm },
  copyTxt:     { fontFamily: fonts.jpBody, fontSize: 12, color: colors.text },
});
