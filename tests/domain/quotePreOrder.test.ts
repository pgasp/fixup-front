import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { approvedQuotePreOrderIndicator, patchQuoteForReceivedPurchaseOrder } from '../../domain/quotePreOrder';
import type { PurchaseOrder, Quote } from '../../types';

const baseQuote = (): Quote => ({
  id: 'q1',
  quoteNumber: 'DEV-001',
  clientId: 'c1',
  vehicleId: 'v1',
  date: new Date().toISOString(),
  validityDuration: 30,
  taxRate: 20,
  laborItems: [
    {
      id: 'l1',
      description: 'MO',
      hours: 1,
      rate: 50,
      partItems: [
        {
          id: 'line-part-1',
          partId: 'p1',
          description: 'Filtre',
          quantity: 2,
          unitPrice: 10,
          isPreOrder: true,
          preOrderStatus: 'priced',
          supplier: 'SupA',
        },
      ],
    },
  ],
  status: 'approved',
  statusHistory: [{ status: 'approved', date: new Date().toISOString() }],
});

describe('quotePreOrder helpers', () => {
  it('approvedQuotePreOrderIndicator: none when no supplier order yet', () => {
    assert.equal(approvedQuotePreOrderIndicator(baseQuote()), 'none');
  });

  it('approvedQuotePreOrderIndicator: waiting when at least one ordered', () => {
    const q = baseQuote();
    q.laborItems[0].partItems[0].preOrderStatus = 'ordered';
    assert.equal(approvedQuotePreOrderIndicator(q), 'waiting');
  });

  it('approvedQuotePreOrderIndicator: fulfilled when ordered lines are received', () => {
    const q = baseQuote();
    q.laborItems[0].partItems[0].preOrderStatus = 'received';
    assert.equal(approvedQuotePreOrderIndicator(q), 'fulfilled');
  });

  it('patchQuoteForReceivedPurchaseOrder marks line by sourceQuotePartItemId', () => {
    const q = baseQuote();
    q.laborItems[0].partItems[0].preOrderStatus = 'ordered';
    const order: PurchaseOrder = {
      id: 'po1',
      orderNumber: 'CMD-1',
      supplier: 'SupA',
      date: new Date().toISOString(),
      status: 'received',
      items: [
        {
          id: 'po-line',
          partId: 'p1',
          description: 'Filtre',
          quantity: 2,
          unitPrice: 5,
          sourceQuotePartItemId: 'line-part-1',
        },
      ],
    };
    const next = patchQuoteForReceivedPurchaseOrder(q, order);
    assert.equal(next.laborItems[0].partItems[0].preOrderStatus, 'received');
  });
});
