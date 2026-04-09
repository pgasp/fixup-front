import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateInvoiceTotal,
  calculatePurchaseOrderTotal,
  calculateQuoteSubtotal,
  calculateQuoteTaxAmount,
  calculateQuoteTotal,
} from '../../domain/financial';
import { Invoice, PurchaseOrder, Quote } from '../../types';

const quoteFixture: Quote = {
  id: 'q-1',
  quoteNumber: 'DEV-00001',
  clientId: 'c-1',
  vehicleId: 'v-1',
  date: new Date().toISOString(),
  validityDuration: 30,
  taxRate: 20,
  status: 'draft',
  statusHistory: [{ status: 'draft', date: new Date().toISOString() }],
  laborItems: [
    {
      id: 'labor-1',
      description: 'Diagnostic',
      hours: 2,
      rate: 50,
      partItems: [
        { id: 'part-1', partId: 'p-1', description: 'Filtre', quantity: 2, unitPrice: 10 },
      ],
    },
    {
      id: 'labor-2',
      description: 'Remplacement',
      hours: 1,
      rate: 100,
      partItems: [
        { id: 'part-2', partId: 'p-2', description: 'Courroie', quantity: 1, unitPrice: 40 },
      ],
    },
  ],
};

describe('financial domain helpers', () => {
  it('calculates quote subtotal/tax/total consistently', () => {
    assert.equal(calculateQuoteSubtotal(quoteFixture), 260);
    assert.equal(calculateQuoteTaxAmount(quoteFixture), 52);
    assert.equal(calculateQuoteTotal(quoteFixture), 312);
  });

  it('calculates invoice total from quote rules', () => {
    const invoice: Invoice = {
      id: 'inv-1',
      invoiceNumber: 'FAC-2026-0001',
      quote: quoteFixture,
      date: new Date().toISOString(),
      dueDate: new Date().toISOString(),
      status: 'draft',
    };

    assert.equal(calculateInvoiceTotal(invoice), 312);
  });

  it('calculates purchase order total', () => {
    const order: PurchaseOrder = {
      id: 'po-1',
      orderNumber: 'CMD-00001',
      supplier: 'Supplier A',
      date: new Date().toISOString(),
      status: 'draft',
      items: [
        { id: 'i-1', partId: 'p-1', description: 'Pièce A', quantity: 3, unitPrice: 12 },
        { id: 'i-2', partId: 'p-2', description: 'Pièce B', quantity: 2, unitPrice: 20 },
      ],
    };

    assert.equal(calculatePurchaseOrderTotal(order), 76);
  });
});
