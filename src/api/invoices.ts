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

// fetchInvoiceHTML retrieves the rendered 適格請求書 HTML for in-app display.
// Uses the standard Bearer Authorization header (via apiClient interceptor) so
// the JWT never appears in a URL query string, server access log, or browser
// history (the system browser used by Linking.openURL cannot attach headers).
export async function fetchInvoiceHTML(invoiceNo: string): Promise<string> {
  const res = await apiClient.get<string>(`/api/user/self/invoices/${encodeURIComponent(invoiceNo)}`, {
    headers: { Accept: 'text/html' },
    responseType: 'text',
    transformResponse: [(data) => data as string],
  });
  return res.data;
}
