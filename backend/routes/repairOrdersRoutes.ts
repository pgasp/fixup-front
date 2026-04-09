import { Router } from 'express';
import {
  createInvoiceForRepairOrder,
  createRepairOrder,
  deleteRepairOrder,
  getRepairOrder,
  listRepairOrders,
  updateRepairOrder,
} from '../controllers/repairOrdersController';
import { requireBody } from '../middleware/validate';
import { AppDataStore } from '../types';

export const createRepairOrdersRouter = (store: AppDataStore): Router => {
  const router = Router();
  router.get('/', listRepairOrders(store));
  router.get('/:orderId', getRepairOrder(store));
  router.post('/', requireBody, createRepairOrder(store));
  router.put('/:orderId', requireBody, updateRepairOrder(store));
  router.delete('/:orderId', deleteRepairOrder(store));
  router.post('/:orderId/invoice', createInvoiceForRepairOrder(store));
  return router;
};
