import { Request, Response } from 'express';
import { HttpError } from '../errors';
import { payInvoice } from '../services/workflows';
import { AppDataStore } from '../types';

export const listInvoices = (store: AppDataStore) => (_req: Request, res: Response): void => {
  res.json(store.invoices);
};

export const createInvoice = (store: AppDataStore) => (req: Request, res: Response): void => {
  const repairOrderId = req.body?.repairOrderId;
  if (!repairOrderId) {
    throw new HttpError(400, 'repairOrderId is required');
  }
  const order = store.repairOrders.find((item) => item.id === repairOrderId);
  if (!order) {
    throw new HttpError(404, 'Repair order not found');
  }
  const existing = store.invoices.find((item) => item.quote.id === order.quote.id);
  if (existing) {
    throw new HttpError(409, 'Invoice already exists for repair order');
  }
  const invoice = {
    id: crypto.randomUUID(),
    invoiceNumber: `FAC-${new Date().getFullYear()}-${String(store.invoices.length + 1).padStart(4, '0')}`,
    quote: order.quote,
    date: new Date().toISOString(),
    dueDate: new Date(Date.now() + (30 * 24 * 60 * 60 * 1000)).toISOString(),
    status: 'draft' as const,
  };
  store.invoices.push(invoice);
  res.status(201).json(invoice);
};

export const deleteInvoice = (store: AppDataStore) => (req: Request, res: Response): void => {
  const index = store.invoices.findIndex((item) => item.id === req.params.invoiceId);
  if (index === -1) {
    throw new HttpError(404, 'Invoice not found');
  }
  store.invoices.splice(index, 1);
  res.status(204).send();
};

export const markInvoiceAsPaid = (store: AppDataStore) => (req: Request, res: Response): void => {
  const payload = req.body;
  if (!payload?.date || !payload?.method) {
    throw new HttpError(400, 'date and method are required');
  }
  const invoice = payInvoice(store, req.params.invoiceId, payload);
  res.json(invoice);
};
