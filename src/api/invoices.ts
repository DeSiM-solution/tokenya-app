// Phase 1: vanilla one-hub does not implement 適格請求書 (Japanese qualified
// invoice). All exports keep their async signatures so callers don't change,
// but return empty/null synchronously without a network call. Phase 3 rewrites
// this module against the real backend contract once Phase 2 ships.

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
  return [];
}

export async function getInvoiceEmailConfig(): Promise<InvoiceEmailConfig | null> {
  return null;
}

export async function fetchInvoiceHTML(_invoiceNo: string): Promise<string> {
  return '';
}
