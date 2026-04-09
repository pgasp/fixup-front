import { Router } from 'express';
import {
  changeQuoteStatus,
  createQuote,
  deleteQuote,
  getQuote,
  listQuotes,
  updateQuote,
} from '../controllers/quotesController';
import { requireBody } from '../middleware/validate';
import { AppDataStore } from '../types';

export const createQuotesRouter = (store: AppDataStore): Router => {
  const router = Router();
  router.get('/', listQuotes(store));
  router.get('/:quoteId', getQuote(store));
  router.post('/', requireBody, createQuote(store));
  router.put('/:quoteId', requireBody, updateQuote(store));
  router.delete('/:quoteId', deleteQuote(store));
  router.put('/:quoteId/status', requireBody, changeQuoteStatus(store));
  return router;
};
