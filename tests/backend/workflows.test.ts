import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import type { Quote } from '../../types';
import { createInitialStore } from '../../backend/state/store';
import {
  createInvoiceFromRepairOrder,
  createRepairOrderFromQuote,
  payInvoice,
  updateQuoteStatus,
} from '../../backend/services/workflows';

const isoNow = (): string => new Date().toISOString();

const minimalApprovedQuote = (id: string): Quote => {
  const d = isoNow();
  return {
    id,
    quoteNumber: `DEV-TEST-${id}`,
    clientId: 'client-1',
    vehicleId: 'veh-1',
    date: d,
    validityDuration: 30,
    taxRate: 20,
    status: 'approved',
    statusHistory: [
      { status: 'draft', date: d },
      { status: 'approved', date: d },
    ],
    isConvertedToRepairOrder: false,
    laborItems: [
      {
        id: 'labor-1',
        description: 'Intervention test',
        hours: 1,
        rate: 50,
        partItems: [],
      },
    ],
  };
};

describe('backend workflows', () => {
  it('updates quote status and appends history', () => {
    const store = createInitialStore();
    const q = minimalApprovedQuote('q-wf-1');
    q.status = 'draft';
    q.statusHistory = [{ status: 'draft', date: isoNow() }];
    store.quotes.push(q);
    const updated = updateQuoteStatus(store, q.id, 'sent');
    assert.equal(updated.status, 'sent');
    assert.equal(updated.statusHistory[updated.statusHistory.length - 1]?.status, 'sent');
  });

  it('creates repair order from approved quote', () => {
    const store = createInitialStore();
    const approvedQuote = minimalApprovedQuote('q-wf-2');
    store.quotes.push(approvedQuote);
    const order = createRepairOrderFromQuote(store, approvedQuote.id);
    assert.equal(order.quote.id, approvedQuote.id);
    assert.equal(order.status, 'scheduled');
  });

  it('creates and pays invoice', () => {
    const store = createInitialStore();
    const approvedQuote = minimalApprovedQuote('q-wf-3');
    store.quotes.push(approvedQuote);
    const order = createRepairOrderFromQuote(store, approvedQuote.id);
    const invoice = createInvoiceFromRepairOrder(store, order.id);
    const paid = payInvoice(store, invoice.id, { date: new Date().toISOString(), method: 'card' });
    assert.equal(paid.status, 'paid');
    assert.ok(store.transactions.some((item) => item.referenceId === paid.id));
  });
});
