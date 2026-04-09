import { Request, Response } from 'express';
import { HttpError } from '../errors';
import { updateQuoteStatus } from '../services/workflows';
import { AppDataStore } from '../types';

export const listQuotes = (store: AppDataStore) => (_req: Request, res: Response): void => {
  res.json(store.quotes);
};

export const getQuote = (store: AppDataStore) => (req: Request, res: Response): void => {
  const quote = store.quotes.find((item) => item.id === req.params.quoteId);
  if (!quote) {
    throw new HttpError(404, 'Quote not found');
  }
  res.json(quote);
};

export const createQuote = (store: AppDataStore) => (req: Request, res: Response): void => {
  const payload = req.body;
  const quote = { ...payload, id: crypto.randomUUID() };
  store.quotes.push(quote);
  res.status(201).json(quote);
};

export const updateQuote = (store: AppDataStore) => (req: Request, res: Response): void => {
  const index = store.quotes.findIndex((item) => item.id === req.params.quoteId);
  if (index === -1) {
    throw new HttpError(404, 'Quote not found');
  }
  const updated = { ...req.body, id: req.params.quoteId };
  store.quotes[index] = updated;
  res.json(updated);
};

export const deleteQuote = (store: AppDataStore) => (req: Request, res: Response): void => {
  const index = store.quotes.findIndex((item) => item.id === req.params.quoteId);
  if (index === -1) {
    throw new HttpError(404, 'Quote not found');
  }
  store.quotes.splice(index, 1);
  res.status(204).send();
};

export const changeQuoteStatus = (store: AppDataStore) => (req: Request, res: Response): void => {
  const status = req.body?.status;
  if (!status) {
    throw new HttpError(400, 'status is required');
  }
  const updated = updateQuoteStatus(store, req.params.quoteId, status);
  res.json(updated);
};
