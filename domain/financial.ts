import { Invoice, PurchaseOrder, Quote } from '../types';

export const calculateQuoteSubtotal = (quote: Pick<Quote, 'laborItems'>): number => {
  return quote.laborItems.reduce((acc, labor) => {
    const laborCost = labor.hours * labor.rate;
    const partsCost = labor.partItems.reduce((partsAcc, part) => {
      return partsAcc + (part.quantity * part.unitPrice);
    }, 0);
    return acc + laborCost + partsCost;
  }, 0);
};

export const calculateQuoteTaxAmount = (quote: Pick<Quote, 'laborItems' | 'taxRate'>): number => {
  return calculateQuoteSubtotal(quote) * (quote.taxRate / 100);
};

export const calculateQuoteTotal = (quote: Pick<Quote, 'laborItems' | 'taxRate'>): number => {
  return calculateQuoteSubtotal(quote) + calculateQuoteTaxAmount(quote);
};

export const calculateInvoiceTotal = (invoice: Pick<Invoice, 'quote'>): number => {
  return calculateQuoteTotal(invoice.quote);
};

export const calculatePurchaseOrderTotal = (order: Pick<PurchaseOrder, 'items'>): number => {
  return order.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
};
