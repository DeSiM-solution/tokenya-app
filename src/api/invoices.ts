import { apiClient } from './client';

export interface Invoice {
  invoice_no:    string;
  total_jpy:     number;
  issued_at:     number;
  status?:       'pending' | 'issued';
  period_label?: string;
}

export interface InvoiceEmailConfig {
  email:   string;
  enabled: boolean;
}

export async function listInvoices(): Promise<Invoice[]> {
  const res = await apiClient.get('/api/user/self/invoices');
  return res.data.data ?? [];
}

export async function getInvoiceEmailConfig(): Promise<InvoiceEmailConfig | null> {
  try {
    const res = await apiClient.get('/api/user/self/invoice-config');
    return res.data.data ?? null;
  } catch { return null; }
}

export function getInvoiceURL(invoiceNo: string): string {
  const base = process.env.EXPO_PUBLIC_API_URL ?? 'https://api.tokenya.ai';
  return `${base}/api/user/self/invoices/${invoiceNo}`;
}
