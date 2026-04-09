import { Router } from 'express';
import {
  createInvoice,
  deleteInvoice,
  listInvoices,
  markInvoiceAsPaid,
} from '../controllers/invoicesController';
import { requireBody } from '../middleware/validate';
import { AppDataStore } from '../types';

export const createInvoicesRouter = (store: AppDataStore): Router => {
  const router = Router();
  router.get('/', listInvoices(store));
  router.post('/', requireBody, createInvoice(store));
  router.delete('/:invoiceId', deleteInvoice(store));
  router.post('/:invoiceId/pay', requireBody, markInvoiceAsPaid(store));
  return router;
};
