import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { createInitialStore } from '../../backend/state/store';
import {
  createInvoiceFromRepairOrder,
  createRepairOrderFromQuote,
  payInvoice,
  updateQuoteStatus,
} from '../../backend/services/workflows';

describe('backend workflows', () => {
  it('updates quote status and appends history', () => {
    const store = createInitialStore();
    const quote = store.quotes[0];
    const updated = updateQuoteStatus(store, quote.id, 'sent');
    assert.equal(updated.status, 'sent');
    assert.equal(updated.statusHistory[updated.statusHistory.length - 1]?.status, 'sent');
  });

  it('creates repair order from approved quote', () => {
    const store = createInitialStore();
    const approvedQuote = store.quotes.find((quote) => quote.status === 'approved' && !quote.isConvertedToRepairOrder);
    assert.ok(approvedQuote);
    const order = createRepairOrderFromQuote(store, approvedQuote.id);
    assert.equal(order.quote.id, approvedQuote.id);
    assert.equal(order.status, 'scheduled');
  });

  it('creates and pays invoice', () => {
    const store = createInitialStore();
    const approvedQuote = store.quotes.find((quote) => quote.status === 'approved' && !quote.isConvertedToRepairOrder);
    assert.ok(approvedQuote);
    const order = createRepairOrderFromQuote(store, approvedQuote.id);
    const invoice = createInvoiceFromRepairOrder(store, order.id);
    const paid = payInvoice(store, invoice.id, { date: new Date().toISOString(), method: 'card' });
    assert.equal(paid.status, 'paid');
    assert.ok(store.transactions.some((item) => item.referenceId === paid.id));
  });
});
