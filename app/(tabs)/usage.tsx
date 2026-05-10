import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import {
  getUsageSummary,
  type ModelUsage,
  type DailyUsage,
  type Period,
} from '../../src/api/usage';
import { colors, fonts, radii, spacing } from '../../src/constants/tokens';
import { formatJPY, formatTokens } from '../../src/utils/format';

// ─── Period tabs ────────────────────────────────────────────────────────────

const PERIODS: { key: Period; label: string }[] = [
  { key: 'today', label: '今日' },
  { key: 'week',  label: '今週' },
  { key: 'month', label: '今月' },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function todayString(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function formatAxisDate(dateStr: string): string {
  // 'YYYY-MM-DD' → 'M/DD'
  const parts = dateStr.split('-');
  if (parts.length < 3) return dateStr;
  return `${parseInt(parts[1], 10)}/${parts[2]}`;
}

// ─── Bar chart ───────────────────────────────────────────────────────────────

interface BarChartProps {
  daily?:        DailyUsage[];
  totalCostJPY:  number;
}

function BarChart({ daily, totalCostJPY }: BarChartProps) {
  const CHART_HEIGHT = 80;
  const today = todayString();

  // Build display data — up to 14 bars
  const hasData = daily != null && daily.length > 0;
  const bars: (DailyUsage & { isToday: boolean })[] = hasData
    ? daily!.slice(-14).map((d) => ({ ...d, isToday: d.date === today }))
    : Array.from({ length: 14 }, (_, i) => ({
        date:    '',
        costJPY: 0,
        isToday: i === 13,
      }));

  const maxVal = hasData
    ? Math.max(...bars.map((b) => b.costJPY), 1)
    : 1;

  // Axis labels: first, middle, last
  const firstLabel  = hasData && bars[0].date  ? formatAxisDate(bars[0].date)  : '';
  const middleIndex = Math.floor((bars.length - 1) / 2);
  const middleLabel = hasData && bars[middleIndex].date
    ? formatAxisDate(bars[middleIndex].date)
    : '';

  return (
    <View style={chartStyles.wrapper}>
      {/* Title row */}
      <View style={chartStyles.titleRow}>
        <Text style={chartStyles.chartTitle}>日別 — 直近 14 日</Text>
        {totalCostJPY > 0 && (
          <Text style={chartStyles.chartMeta}>{formatJPY(totalCostJPY)} / 月</Text>
        )}
      </View>

      {/* Bars */}
      <View style={[chartStyles.barsContainer, { height: CHART_HEIGHT }]}>
        {bars.map((bar, idx) => {
          const ratio    = hasData ? Math.max(bar.costJPY / maxVal, 0) : 0.3;
          const barH     = Math.max(ratio * CHART_HEIGHT, 4);
          const barColor = bar.isToday ? colors.cyan : colors.vermilion;

          return (
            <View key={idx} style={chartStyles.barWrapper}>
              {bar.isToday && (
                <Text style={chartStyles.todayLabel}>今日</Text>
              )}
              <View
                style={[
                  chartStyles.bar,
                  { height: barH, backgroundColor: barColor },
                ]}
              />
            </View>
          );
        })}
      </View>

      {/* Axis labels */}
      <View style={chartStyles.axisRow}>
        <Text style={chartStyles.axisLabel}>{firstLabel}</Text>
        <Text style={chartStyles.axisLabel}>{middleLabel}</Text>
        <Text style={chartStyles.axisLabel}>今日</Text>
      </View>
    </View>
  );
}

const chartStyles = StyleSheet.create({
  wrapper: {
    marginBottom: spacing.lg,
  },
  titleRow: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    alignItems:     'center',
    marginBottom:   spacing.sm,
  },
  chartTitle: {
    fontFamily: fonts.mono,
    fontSize:   10,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: colors.textDim,
  },
  chartMeta: {
    fontFamily: fonts.mono,
    fontSize:   11,
    color:      colors.textMuted,
  },
  barsContainer: {
    flexDirection: 'row',
    alignItems:    'flex-end',
    gap:           2,
  },
  barWrapper: {
    flex:           1,
    alignItems:     'center',
    justifyContent: 'flex-end',
  },
  bar: {
    width: '100%',
    borderRadius: 2,
  },
  todayLabel: {
    fontFamily: fonts.mono,
    fontSize:   8,
    color:      colors.cyan,
    marginBottom: 2,
  },
  axisRow: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    marginTop:      spacing.xs,
  },
  axisLabel: {
    fontFamily: fonts.mono,
    fontSize:   10,
    color:      colors.textDim,
  },
});

// ─── Tier progress ───────────────────────────────────────────────────────────

interface TierProgressProps {
  tierName:     string;
  tierProgress: number;
}

function TierProgress({ tierName, tierProgress }: TierProgressProps) {
  const pct = Math.min((tierProgress ?? 0) * 100, 100);
  return (
    <View style={tierStyles.card}>
      <View style={tierStyles.row}>
        <Text style={tierStyles.tierName}>{tierName} ティア 継続中</Text>
      </View>
      <View style={tierStyles.track}>
        <View style={[tierStyles.fill, { width: `${pct}%` as `${number}%` }]} />
      </View>
    </View>
  );
}

const tierStyles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderWidth:     1,
    borderColor:     colors.line,
    borderRadius:    radii.card,
    padding:         spacing.md,
    marginBottom:    spacing.lg,
  },
  row: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    alignItems:     'center',
    marginBottom:   spacing.sm,
  },
  tierName: {
    fontFamily: fonts.jpBody,
    fontSize:   13,
    color:      colors.gold,
  },
  track: {
    height:          4,
    backgroundColor: colors.line,
    borderRadius:    2,
    overflow:        'hidden',
  },
  fill: {
    height:          4,
    backgroundColor: colors.gold,
    borderRadius:    2,
  },
});

// ─── Model breakdown ─────────────────────────────────────────────────────────

interface ModelBreakdownProps {
  byModel:      ModelUsage[];
  totalCostJPY: number;
}

function ModelBreakdown({ byModel, totalCostJPY }: ModelBreakdownProps) {
  if (byModel.length === 0) {
    return (
      <Text style={breakdownStyles.empty}>使用データがありません</Text>
    );
  }

  return (
    <View style={breakdownStyles.list}>
      {byModel.map((item, idx) => {
        const pct    = totalCostJPY > 0 ? item.costJPY / totalCostJPY : 0;
        const pctPct = Math.round(pct * 100);
        const isLast = idx === byModel.length - 1;

        return (
          <View
            key={item.model}
            style={[
              breakdownStyles.row,
              isLast && breakdownStyles.rowLast,
            ]}
          >
            {/* Top line: model name + cost */}
            <View style={breakdownStyles.topLine}>
              <Text style={breakdownStyles.modelName} numberOfLines={1}>
                {item.model}
              </Text>
              <Text style={breakdownStyles.modelCost}>
                {formatJPY(item.costJPY)}
              </Text>
            </View>

            {/* Progress bar */}
            <View style={breakdownStyles.barTrack}>
              <View
                style={[
                  breakdownStyles.barFill,
                  { width: `${Math.max(pct * 100, pct > 0 ? 1 : 0)}%` as `${number}%` },
                ]}
              />
            </View>

            {/* Sub label */}
            <Text style={breakdownStyles.subLabel}>
              {pctPct}% · {formatTokens(item.tokens)} tok
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const breakdownStyles = StyleSheet.create({
  list: {
    backgroundColor: colors.ink2,
    borderWidth:     1,
    borderColor:     colors.line,
    borderRadius:    radii.card,
    overflow:        'hidden',
  },
  row: {
    padding:           14,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  topLine: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    alignItems:     'center',
    marginBottom:   6,
  },
  modelName: {
    fontFamily: fonts.mono,
    fontSize:   14,
    color:      colors.text,
    fontStyle:  'italic',
    flex:       1,
    marginRight: 8,
  },
  modelCost: {
    fontFamily: fonts.mono,
    fontSize:   13,
    color:      colors.vermilion,
  },
  barTrack: {
    height:          4,
    backgroundColor: colors.line,
    borderRadius:    2,
    overflow:        'hidden',
    marginBottom:    4,
  },
  barFill: {
    height:          4,
    backgroundColor: colors.vermilion,
    borderRadius:    2,
  },
  subLabel: {
    fontFamily: fonts.mono,
    fontSize:   10,
    color:      colors.textDim,
  },
  empty: {
    fontFamily: fonts.jpBody,
    fontSize:   14,
    color:      colors.textMuted,
    textAlign:  'center',
    padding:    40,
  },
});

// ─── Main screen ─────────────────────────────────────────────────────────────

export default function UsageScreen() {
  const [period, setPeriod] = useState<Period>('month');

  const [byModel,       setByModel]       = useState<ModelUsage[]>([]);
  const [totalTokens,   setTotalTokens]   = useState(0);
  const [totalCostJPY,  setTotalCostJPY]  = useState(0);
  const [daily,         setDaily]         = useState<DailyUsage[] | undefined>(undefined);
  const [tierName,      setTierName]      = useState<string | undefined>(undefined);
  const [tierProgress,  setTierProgress]  = useState<number>(0);
  const [requestCount,  setRequestCount]  = useState<number | undefined>(undefined);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;

      (async () => {
        setLoading(true);
        setError(null);
        try {
          const d = await getUsageSummary(period);
          if (!cancelled) {
            setByModel(d.byModel);
            setTotalTokens(d.totalTokens);
            setTotalCostJPY(d.totalCostJPY);
            setDaily(d.daily);
            setTierName(d.tierName);
            setTierProgress(d.tierProgress ?? 0);
            setRequestCount(d.requestCount);
          }
        } catch {
          if (!cancelled) setError('データの取得に失敗しました。');
        } finally {
          if (!cancelled) setLoading(false);
        }
      })();

      return () => { cancelled = true; };
    }, [period]),
  );

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>使用状況</Text>

        {/* ── Period tabs ── */}
        <View style={styles.tabRow}>
          {PERIODS.map((p) => (
            <Pressable
              key={p.key}
              style={[styles.tab, period === p.key && styles.tabActive]}
              onPress={() => setPeriod(p.key)}
            >
              <Text style={[styles.tabLabel, period === p.key && styles.tabLabelActive]}>
                {p.label}
              </Text>
            </Pressable>
          ))}
          {/* カスタム tab — non-interactive placeholder */}
          <View style={[styles.tab, styles.tabDisabled]}>
            <Text style={styles.tabLabel}>カスタム</Text>
          </View>
        </View>

        {error && <Text style={styles.errorText}>{error}</Text>}

        {loading ? (
          <ActivityIndicator color={colors.vermilion} style={{ marginTop: 40 }} />
        ) : (
          <>
            {/* ── Hero totals ── */}
            <Text style={styles.heroAmount}>{formatJPY(totalCostJPY)}</Text>
            <Text style={styles.heroMeta}>
              {formatTokens(totalTokens)} トークン
              {requestCount != null ? ` · ${requestCount.toLocaleString('ja-JP')} リクエスト` : ''}
            </Text>

            <View style={styles.divider} />

            {/* ── Tier progress (only when tierName present) ── */}
            {tierName != null && (
              <TierProgress tierName={tierName} tierProgress={tierProgress} />
            )}

            {/* ── Bar chart ── */}
            <BarChart daily={daily} totalCostJPY={totalCostJPY} />

            <View style={styles.divider} />

            {/* ── Model breakdown ── */}
            <Text style={styles.sectionH}>モデル別の内訳</Text>
            <ModelBreakdown byModel={byModel} totalCostJPY={totalCostJPY} />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root:    { flex: 1, backgroundColor: colors.ink },
  content: { padding: 20, paddingBottom: 100 },

  title: {
    fontFamily:   fonts.jpDisplay,
    fontSize:     24,
    fontWeight:   '700',
    color:        colors.text,
    marginBottom: spacing.lg,
  },

  // Period tabs
  tabRow: {
    flexDirection:  'row',
    gap:            8,
    marginBottom:   spacing.lg,
  },
  tab: {
    paddingHorizontal: 14,
    paddingVertical:   7,
    borderRadius:      radii.button,
    borderWidth:       1,
    borderColor:       colors.line,
  },
  tabActive: {
    backgroundColor: colors.surface,
    borderColor:     colors.vermilion,
  },
  tabDisabled: {
    opacity: 0.4,
  },
  tabLabel: {
    fontFamily: fonts.jpBody,
    fontSize:   13,
    color:      colors.textMuted,
  },
  tabLabelActive: {
    color: colors.text,
  },

  // Hero
  heroAmount: {
    fontFamily:   fonts.jpDisplay,
    fontSize:     36,
    fontWeight:   '700',
    color:        colors.text,
    marginBottom: spacing.xs,
  },
  heroMeta: {
    fontFamily:   fonts.mono,
    fontSize:     12,
    color:        colors.textMuted,
    marginBottom: spacing.lg,
  },

  divider: {
    height:          1,
    backgroundColor: colors.line,
    marginBottom:    spacing.lg,
  },

  sectionH: {
    fontFamily:    fonts.mono,
    fontSize:      10,
    letterSpacing: 2.5,
    textTransform: 'uppercase',
    color:         colors.textDim,
    marginBottom:  14,
  },

  errorText: {
    fontFamily: fonts.jpBody,
    fontSize:   13,
    color:      colors.vermilion,
    textAlign:  'center',
    marginTop:  20,
  },
});
