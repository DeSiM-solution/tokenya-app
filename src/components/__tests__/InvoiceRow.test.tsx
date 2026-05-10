import React from 'react';
import { render } from '@testing-library/react-native';
import InvoiceRow from '../InvoiceRow';

const inv = { invoice_no: 'TKY-202601-00001', total_jpy: 5500, issued_at: 1737000000 };

describe('InvoiceRow', () => {
  it('請求書番号を表示する', () => {
    const { getByText } = render(<InvoiceRow invoice={inv} onDownload={() => {}} />);
    expect(getByText('TKY-202601-00001')).toBeTruthy();
  });
  it('金額を表示する', () => {
    const { getByText } = render(<InvoiceRow invoice={inv} onDownload={() => {}} />);
    expect(getByText('¥5,500')).toBeTruthy();
  });
});
