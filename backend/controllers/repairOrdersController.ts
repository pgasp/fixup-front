import { Request, Response } from 'express';
import { HttpError } from '../errors';
import { asRouteParam } from '../routeParams';
import { createInvoiceFromRepairOrder, createRepairOrderFromQuote } from '../services/workflows';
import { AppDataStore } from '../types';

export const listRepairOrders = (store: AppDataStore) => (_req: Request, res: Response): void => {
  res.json(store.repairOrders);
};

export const getRepairOrder = (store: AppDataStore) => (req: Request, res: Response): void => {
  const order = store.repairOrders.find((item) => item.id === req.params.orderId);
  if (!order) {
    throw new HttpError(404, 'Repair order not found');
  }
  res.json(order);
};

export const createRepairOrder = (store: AppDataStore) => (req: Request, res: Response): void => {
  const quoteId = req.body?.quoteId;
  if (!quoteId) {
    throw new HttpError(400, 'quoteId is required');
  }
  const order = createRepairOrderFromQuote(store, quoteId);
  res.status(201).json(order);
};

export const updateRepairOrder = (store: AppDataStore) => (req: Request, res: Response): void => {
  const index = store.repairOrders.findIndex((item) => item.id === req.params.orderId);
  if (index === -1) {
    throw new HttpError(404, 'Repair order not found');
  }
  const previous = store.repairOrders[index];
  const updated = { ...previous, ...req.body, id: req.params.orderId };
  store.repairOrders[index] = updated;
  res.json(updated);
};

export const deleteRepairOrder = (store: AppDataStore) => (req: Request, res: Response): void => {
  const index = store.repairOrders.findIndex((item) => item.id === req.params.orderId);
  if (index === -1) {
    throw new HttpError(404, 'Repair order not found');
  }
  store.repairOrders.splice(index, 1);
  res.status(204).send();
};

export const createInvoiceForRepairOrder = (store: AppDataStore) => (req: Request, res: Response): void => {
  const invoice = createInvoiceFromRepairOrder(store, asRouteParam(req.params.orderId));
  res.status(201).json(invoice);
};
