import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Switch,
  ScrollView,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAuthStore } from '../src/store/auth';
import { useBalanceStore } from '../src/store/balance';
import { secureStore } from '../src/utils/secure-store';
import { colors, fonts, radii } from '../src/constants/tokens';

// ─── Sub-components ──────────────────────────────────────────────────────────

function SettingsGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.group}>
      <Text style={styles.groupTitle}>{title}</Text>
      <View style={styles.groupList}>{children}</View>
    </View>
  );
}

function SettingsRow({
  label,
  meta,
  value,
  valueColor,
  onPress,
  isLast,
}: {
  label: string;
  meta?: string;
  value?: string;
  valueColor?: string;
  onPress?: () => void;
  isLast?: boolean;
}) {
  return (
    <TouchableOpacity
      style={[styles.row, isLast && styles.rowLast]}
      onPress={onPress ?? (() => {})}
      activeOpacity={0.7}
    >
      <View style={styles.rowInfo}>
        <Text style={styles.rowName}>{label}</Text>
        {meta ? <Text style={styles.rowMeta}>{meta}</Text> : null}
      </View>
      {value ? (
        <Text style={[styles.rowValue, valueColor ? { color: valueColor } : null]}>
          {value}
        </Text>
      ) : null}
      {onPress ? <Text style={styles.chevron}>›</Text> : null}
    </TouchableOpacity>
  );
}

function ToggleRow({
  label,
  meta,
  value,
  onValueChange,
  isLast,
}: {
  label: string;
  meta?: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
  isLast?: boolean;
}) {
  return (
    <View style={[styles.row, isLast && styles.rowLast]}>
      <View style={styles.rowInfo}>
        <Text style={styles.rowName}>{label}</Text>
        {meta ? <Text style={styles.rowMeta}>{meta}</Text> : null}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: colors.line, true: colors.vermilion }}
        thumbColor={colors.text}
      />
    </View>
  );
}

// ─── Main Screen ─────────────────────────────────────────────────────────────

export default function SettingsScreen() {
  const { user, clearAuth } = useAuthStore();
  const { tier } = useBalanceStore();

  const [pushEnabled, setPushEnabled]       = useState(true);
  const [summaryEnabled, setSummaryEnabled] = useState(true);
  const [alertEnabled, setAlertEnabled]     = useState(true);

  const avatarLetter = user?.username?.[0]?.toUpperCase() ?? 'U';

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
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>設定</Text>
        <TouchableOpacity style={styles.helpBtn} onPress={() => {}}>
          <Text style={styles.helpTxt}>?</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {/* Profile Card */}
        <TouchableOpacity style={styles.profileCard} onPress={() => {}} activeOpacity={0.8}>
          <View style={styles.avatar}>
            <Text style={styles.avatarLetter}>{avatarLetter}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user?.username ?? '—'}</Text>
            <Text style={styles.profileEmail}>{user?.email ?? '—'}</Text>
            {tier ? (
              <Text style={styles.profileTier}>{tier} ティア — 個人プラン</Text>
            ) : null}
          </View>
          <Text style={styles.profileChevron}>›</Text>
        </TouchableOpacity>

        {/* アカウント group */}
        <SettingsGroup title="アカウント">
          <SettingsRow
            label="プロフィール情報"
            onPress={() => {}}
          />
          <SettingsRow
            label="2 段階認証"
            meta="SMS · 認証アプリ"
            value="有効"
            valueColor={colors.cyan}
            onPress={() => {}}
          />
          <SettingsRow
            label="お支払方法"
            meta="JCB **** 4242"
            onPress={() => {}}
            isLast
          />
        </SettingsGroup>

        {/* 通知 group */}
        <SettingsGroup title="通知">
          <ToggleRow
            label="プッシュ通知"
            meta="残高低下・ティア変更"
            value={pushEnabled}
            onValueChange={setPushEnabled}
          />
          <ToggleRow
            label="月次サマリーメール"
            meta="毎月 1 日に送付"
            value={summaryEnabled}
            onValueChange={setSummaryEnabled}
          />
          <ToggleRow
            label="異常使用量アラート"
            meta="前日比 +200% で通知"
            value={alertEnabled}
            onValueChange={setAlertEnabled}
            isLast
          />
        </SettingsGroup>

        {/* アプリについて group */}
        <SettingsGroup title="アプリについて">
          <SettingsRow
            label="バージョン"
            value="1.0.0"
          />
          <SettingsRow
            label="AGPL-3.0 ソースコード"
            value="GitHub"
            valueColor={colors.cyan}
            onPress={() => Linking.openURL('https://github.com/DeSiM-solution/tokenya-api')}
            isLast
          />
        </SettingsGroup>

        {/* Spacer for logout button */}
        <View style={styles.spacer} />

        {/* Logout button */}
        <View style={styles.logoutWrapper}>
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Text style={styles.logoutTxt}>ログアウト</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root:           { flex: 1, backgroundColor: colors.ink },
  scroll:         { flex: 1 },
  scrollContent:  { paddingBottom: 48 },

  // Header
  header:         { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 },
  headerTitle:    { fontFamily: fonts.jpDisplay, fontSize: 20, fontWeight: '700', color: colors.text },
  helpBtn:        { width: 28, height: 28, borderRadius: 14, borderWidth: 1, borderColor: colors.lineStrong, alignItems: 'center', justifyContent: 'center' },
  helpTxt:        { fontFamily: fonts.mono, fontSize: 12, color: colors.textMuted },

  // Profile card
  profileCard:    { flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, marginTop: 8, padding: 16, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: radii.card },
  avatar:         { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.ink2, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  avatarLetter:   { fontFamily: fonts.jpDisplay, fontSize: 18, fontWeight: '700', color: colors.text },
  profileInfo:    { flex: 1 },
  profileName:    { fontFamily: fonts.jpDisplay, fontSize: 16, fontWeight: '700', color: colors.text },
  profileEmail:   { fontFamily: fonts.mono, fontSize: 12, color: colors.textMuted, marginTop: 2 },
  profileTier:    { fontFamily: fonts.mono, fontSize: 11, color: colors.textMuted, marginTop: 4 },
  profileChevron: { fontFamily: fonts.jpBody, fontSize: 18, color: colors.textDim, marginLeft: 8 },

  // Settings group
  group:          { marginTop: 28, paddingHorizontal: 20 },
  groupTitle:     { fontFamily: fonts.mono, fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: colors.textDim, marginBottom: 10 },
  groupList:      { backgroundColor: colors.ink2, borderWidth: 1, borderColor: colors.line, borderRadius: radii.card, overflow: 'hidden' },

  // Settings row
  row:            { flexDirection: 'row', alignItems: 'center', padding: 14, borderBottomWidth: 1, borderBottomColor: colors.line },
  rowLast:        { borderBottomWidth: 0 },
  rowInfo:        { flex: 1 },
  rowName:        { fontFamily: fonts.jpBody, fontSize: 14, color: colors.text },
  rowMeta:        { fontFamily: fonts.mono, fontSize: 11, color: colors.textMuted, marginTop: 2 },
  rowValue:       { fontFamily: fonts.mono, fontSize: 12, color: colors.textMuted },
  chevron:        { fontFamily: fonts.jpBody, fontSize: 18, color: colors.textDim, marginLeft: 8 },

  // Logout
  spacer:         { height: 32 },
  logoutWrapper:  { paddingHorizontal: 20 },
  logoutBtn:      { borderWidth: 1, borderColor: colors.vermilion, borderRadius: radii.button, padding: 16, alignItems: 'center' },
  logoutTxt:      { fontFamily: fonts.jpBody, fontSize: 14, color: colors.vermilion, fontWeight: '700' },
});
