import {
  FinancialTransaction,
  Invoice,
  PaymentDetails,
  Quote,
  QuoteStatus,
  RepairOrder,
  RepairOrderStatus,
} from '../../types';
import { HttpError } from '../errors';
import { AppDataStore } from '../types';

const appendQuoteStatus = (quote: Quote, status: QuoteStatus): Quote => {
  const shouldAppend = quote.statusHistory[quote.statusHistory.length - 1]?.status !== status;
  return {
    ...quote,
    status,
    statusHistory: shouldAppend
      ? [...quote.statusHistory, { status, date: new Date().toISOString() }]
      : quote.statusHistory,
  };
};

export const updateQuoteStatus = (store: AppDataStore, quoteId: string, status: QuoteStatus): Quote => {
  const quote = store.quotes.find((item) => item.id === quoteId);
  if (!quote) {
    throw new HttpError(404, 'Quote not found');
  }
  const updated = appendQuoteStatus(quote, status);
  const index = store.quotes.findIndex((item) => item.id === quoteId);
  store.quotes[index] = updated;
  return updated;
};

export const createRepairOrderFromQuote = (store: AppDataStore, quoteId: string): RepairOrder => {
  const quote = store.quotes.find((item) => item.id === quoteId);
  if (!quote) {
    throw new HttpError(404, 'Quote not found');
  }
  if (quote.status !== 'approved') {
    throw new HttpError(400, 'Only approved quotes can be converted');
  }

  const existingOrder = store.repairOrders.find((item) => item.quote.id === quoteId);
  if (existingOrder) {
    throw new HttpError(409, 'Repair order already exists for quote');
  }

  const newOrder: RepairOrder = {
    id: crypto.randomUUID(),
    quote: { ...quote, isConvertedToRepairOrder: true },
    status: 'scheduled',
  };

  store.repairOrders.push(newOrder);
  const quoteIndex = store.quotes.findIndex((item) => item.id === quoteId);
  store.quotes[quoteIndex] = { ...quote, isConvertedToRepairOrder: true };

  return newOrder;
};

const nextInvoiceNumber = (store: AppDataStore): string => {
  const year = new Date().getFullYear();
  const lastNumber = store.invoices.reduce((max, invoice) => {
    const value = Number.parseInt(invoice.invoiceNumber.split('-')[2] ?? '0', 10);
    return Number.isNaN(value) ? max : Math.max(max, value);
  }, 0);
  return `FAC-${year}-${String(lastNumber + 1).padStart(4, '0')}`;
};

const getQuoteTotal = (quote: Quote): number => {
  const subtotal = quote.laborItems.reduce((acc, labor) => {
    const partsTotal = labor.partItems.reduce((partsAcc, part) => partsAcc + (part.quantity * part.unitPrice), 0);
    return acc + (labor.hours * labor.rate) + partsTotal;
  }, 0);
  return subtotal * (1 + (quote.taxRate / 100));
};

export const createInvoiceFromRepairOrder = (store: AppDataStore, repairOrderId: string): Invoice => {
  const order = store.repairOrders.find((item) => item.id === repairOrderId);
  if (!order) {
    throw new HttpError(404, 'Repair order not found');
  }

  const existingInvoice = store.invoices.find((item) => item.quote.id === order.quote.id);
  if (existingInvoice) {
    throw new HttpError(409, 'Invoice already exists for repair order');
  }

  const invoice: Invoice = {
    id: crypto.randomUUID(),
    invoiceNumber: nextInvoiceNumber(store),
    quote: order.quote,
    date: new Date().toISOString(),
    dueDate: new Date(Date.now() + (30 * 24 * 60 * 60 * 1000)).toISOString(),
    status: 'draft',
  };

  store.invoices.push(invoice);
  const updatedStatus: RepairOrderStatus = 'invoiced';
  const orderIndex = store.repairOrders.findIndex((item) => item.id === repairOrderId);
  store.repairOrders[orderIndex] = { ...order, status: updatedStatus };

  return invoice;
};

export const payInvoice = (store: AppDataStore, invoiceId: string, paymentDetails: PaymentDetails): Invoice => {
  const invoice = store.invoices.find((item) => item.id === invoiceId);
  if (!invoice) {
    throw new HttpError(404, 'Invoice not found');
  }
  if (invoice.status === 'paid') {
    throw new HttpError(409, 'Invoice already paid');
  }

  const updatedInvoice: Invoice = {
    ...invoice,
    status: 'paid',
    paymentDetails,
  };
  const invoiceIndex = store.invoices.findIndex((item) => item.id === invoiceId);
  store.invoices[invoiceIndex] = updatedInvoice;

  const transaction: FinancialTransaction = {
    id: crypto.randomUUID(),
    date: paymentDetails.date,
    type: 'revenue',
    amount: getQuoteTotal(updatedInvoice.quote),
    description: `Paiement facture ${updatedInvoice.invoiceNumber}`,
    referenceId: updatedInvoice.id,
  };
  store.transactions.push(transaction);

  return updatedInvoice;
};
