import { listInvoices, getInvoiceEmailConfig, fetchInvoiceHTML } from '../invoices';
import { apiClient } from '../client';

jest.mock('../client', () => ({
  apiClient: { get: jest.fn() },
}));

describe('invoices API (Phase 1 placeholder)', () => {
  beforeEach(() => jest.clearAllMocks());

  it('listInvoices returns [] without network call', async () => {
    expect(await listInvoices()).toEqual([]);
    expect(apiClient.get).not.toHaveBeenCalled();
  });

  it('getInvoiceEmailConfig returns null without network call', async () => {
    expect(await getInvoiceEmailConfig()).toBeNull();
    expect(apiClient.get).not.toHaveBeenCalled();
  });

  it('fetchInvoiceHTML returns empty string without network call', async () => {
    expect(await fetchInvoiceHTML('inv-123')).toBe('');
    expect(apiClient.get).not.toHaveBeenCalled();
  });
});
