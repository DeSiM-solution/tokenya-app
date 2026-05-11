import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  listInvoices, fetchInvoiceHTML, getInvoiceEmailConfig,
  type Invoice, type InvoiceEmailConfig,
} from '../../src/api/invoices';
import InvoiceWebViewModal from '../../src/components/InvoiceWebViewModal';
import { formatJPY } from '../../src/utils/format';
import { colors, fonts, radii, spacing } from '../../src/constants/tokens';

const INVOICE_REG_NUMBER =
  process.env.EXPO_PUBLIC_INVOICE_REGISTRATION_NUMBER ?? 'T5011101087821';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function periodLabel(inv: Invoice): string {
  if (inv.period_label) return inv.period_label;
  const d = new Date(inv.issued_at * 1000);
  return `${d.getMonth() + 1} 月分`;
}

// ---------------------------------------------------------------------------
// InvoiceCard
// ---------------------------------------------------------------------------

interface InvoiceCardProps {
  invoice:    Invoice;
  onDownload: (invoiceNo: string) => void;
}

function InvoiceCard({ invoice, onDownload }: InvoiceCardProps) {
  const isPending = invoice.status === 'pending';
  const label     = periodLabel(invoice);

  return (
    <View style={cardStyles.card}>
      {/* top row: label + amount + download */}
      <View style={cardStyles.row}>
        <View style={cardStyles.labelWrap}>
          <Text style={cardStyles.label}>
            {isPending ? `${label}（進行中）` : label}
          </Text>
        </View>
        <View style={cardStyles.amountWrap}>
          <Text style={isPending ? cardStyles.amountDim : cardStyles.amount}>
            {formatJPY(invoice.total_jpy)}
          </Text>
          {isPending && <Text style={cardStyles.provisional}>暫定</Text>}
        </View>
        {!isPending && (
          <TouchableOpacity
            style={cardStyles.dlBtn}
            onPress={() => onDownload(invoice.invoice_no)}
            accessibilityLabel="ダウンロード"
          >
            <Text style={cardStyles.dlIcon}>↓</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* pending note */}
      {isPending && (
        <Text style={cardStyles.pendingNote}>
          月末締め · 翌月1日発行予定
        </Text>
      )}
    </View>
  );
}

const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderWidth:     1,
    borderColor:     colors.line,
    borderRadius:    radii.card,
    padding:         spacing.md,
    marginBottom:    spacing.sm,
  },
  row: {
    flexDirection:  'row',
    alignItems:     'center',
  },
  labelWrap: {
    flex: 1,
  },
  label: {
    fontFamily: fonts.jpBody,
    fontSize:   15,
    color:      colors.text,
  },
  amountWrap: {
    flexDirection: 'row',
    alignItems:    'center',
    marginRight:   spacing.sm,
    gap:           6,
  },
  amount: {
    fontFamily: fonts.mono,
    fontSize:   15,
    color:      colors.text,
  },
  amountDim: {
    fontFamily: fonts.mono,
    fontSize:   15,
    color:      colors.textDim,
  },
  provisional: {
    fontFamily:      fonts.jpBody,
    fontSize:        10,
    color:           colors.textDim,
    borderWidth:     1,
    borderColor:     colors.textDim,
    borderRadius:    radii.sm,
    paddingHorizontal: 4,
    paddingVertical:   1,
  },
  dlBtn: {
    width:           44,
    height:          44,
    borderWidth:     1,
    borderColor:     colors.vermilion,
    borderRadius:    radii.button,
    alignItems:      'center',
    justifyContent:  'center',
  },
  dlIcon: {
    fontFamily: fonts.mono,
    fontSize:   18,
    color:      colors.vermilion,
  },
  pendingNote: {
    fontFamily:  fonts.jpBody,
    fontSize:    12,
    color:       colors.cyan,
    marginTop:   8,
  },
});

// ---------------------------------------------------------------------------
// EmailConfigSection
// ---------------------------------------------------------------------------

function EmailConfigSection({ config }: { config: InvoiceEmailConfig }) {
  return (
    <View style={emailStyles.container}>
      <Text style={emailStyles.header}>→ メール送付先</Text>
      <Text style={emailStyles.email}>{config.email}</Text>
      <Text style={emailStyles.meta}>
        毎月 1 日に PDF を自動でメール送付します
      </Text>
      <TouchableOpacity accessibilityRole="button">
        <Text style={emailStyles.editBtn}>送付先を編集</Text>
      </TouchableOpacity>
    </View>
  );
}

const emailStyles = StyleSheet.create({
  container: {
    backgroundColor:  colors.ink2,
    borderLeftWidth:  2,
    borderLeftColor:  colors.cyan,
    padding:          spacing.md,
    marginTop:        spacing.lg,
    borderRadius:     radii.sm,
  },
  header: {
    fontFamily:    fonts.mono,
    fontSize:      10,
    color:         colors.cyan,
    letterSpacing: 0.16,
    marginBottom:  6,
  },
  email: {
    fontFamily:   fonts.mono,
    fontSize:     13,
    color:        colors.text,
    marginBottom: 4,
  },
  meta: {
    fontFamily:   fonts.jpBody,
    fontSize:     11,
    color:        colors.textMuted,
    marginBottom: 8,
  },
  editBtn: {
    fontFamily:        fonts.jpBody,
    fontSize:          12,
    color:             colors.vermilion,
    textDecorationLine: 'underline',
  },
});

// ---------------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------------

export default function InvoicesScreen() {
  const [invoices,    setInvoices]    = useState<Invoice[]>([]);
  const [emailConfig, setEmailConfig] = useState<InvoiceEmailConfig | null>(null);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState<string | null>(null);
  const [openInvoice, setOpenInvoice] = useState<{ no: string; html: string } | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const [invData, cfg] = await Promise.all([
          listInvoices(),
          getInvoiceEmailConfig(),
        ]);
        setInvoices(invData);
        setEmailConfig(cfg);
      } catch {
        setError('データの取得に失敗しました。');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleDownload = async (invoiceNo: string) => {
    try {
      // Fetch via authorized API client (Authorization header) and render in-app
      // so the JWT never appears in a URL query string, server log, or browser history.
      const html = await fetchInvoiceHTML(invoiceNo);
      setOpenInvoice({ no: invoiceNo, html });
    } catch {
      setError('請求書の表示に失敗しました。');
    }
  };

  // Group by year (descending)
  const grouped = invoices.reduce<Record<number, Invoice[]>>((acc, inv) => {
    const year = new Date(inv.issued_at * 1000).getFullYear();
    (acc[year] ??= []).push(inv);
    return acc;
  }, {});
  const years = Object.keys(grouped).map(Number).sort((a, b) => b - a);

  return (
    <SafeAreaView style={styles.root}>
      <Text style={styles.title}>適格請求書</Text>

      {/* cyan badge */}
      <View style={styles.badge}>
        <Text style={styles.badgeDot}>◆</Text>
        <Text style={styles.badgeTxt}>
          適格請求書発行事業者 · {INVOICE_REG_NUMBER}
        </Text>
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}

      {loading ? (
        <ActivityIndicator color={colors.vermilion} style={{ marginTop: 40 }} />
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {invoices.length === 0 ? (
            <Text style={styles.empty}>請求書がまだありません</Text>
          ) : (
            years.map(year => (
              <View key={year}>
                <Text style={styles.yearLabel}>{year} 年</Text>
                {grouped[year].map(inv => (
                  <InvoiceCard
                    key={inv.invoice_no}
                    invoice={inv}
                    onDownload={handleDownload}
                  />
                ))}
              </View>
            ))
          )}

          {emailConfig && <EmailConfigSection config={emailConfig} />}
        </ScrollView>
      )}

      {openInvoice && (
        <InvoiceWebViewModal
          html={openInvoice.html}
          invoiceNo={openInvoice.no}
          onClose={() => setOpenInvoice(null)}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex:            1,
    backgroundColor: colors.ink,
  },
  title: {
    fontFamily:   fonts.jpDisplay,
    fontSize:     24,
    fontWeight:   '700',
    color:        colors.text,
    margin:       spacing.md,
    marginBottom: spacing.xs,
  },
  badge: {
    flexDirection:   'row',
    alignItems:      'center',
    marginHorizontal: spacing.md,
    marginBottom:    spacing.md,
    gap:             6,
  },
  badgeDot: {
    fontFamily: fonts.mono,
    fontSize:   10,
    color:      colors.cyan,
  },
  badgeTxt: {
    fontFamily:    fonts.mono,
    fontSize:      10,
    color:         colors.cyan,
    letterSpacing: 0.16,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingBottom:     spacing.xl,
  },
  yearLabel: {
    fontFamily:   fonts.jpBody,
    fontSize:     13,
    color:        colors.textMuted,
    marginTop:    spacing.md,
    marginBottom: spacing.sm,
  },
  empty: {
    fontFamily: fonts.jpBody,
    fontSize:   14,
    color:      colors.textMuted,
    textAlign:  'center',
    padding:    40,
  },
  errorText: {
    fontFamily: fonts.jpBody,
    fontSize:   13,
    color:      colors.vermilion,
    textAlign:  'center',
    margin:     spacing.md,
  },
});
