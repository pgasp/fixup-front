import { Router } from 'express';
import {
  createClient,
  deleteClient,
  getClient,
  listClients,
  updateClient,
} from '../controllers/clientsController';
import { requireBody } from '../middleware/validate';
import { AppDataStore } from '../types';

export const createClientsRouter = (store: AppDataStore): Router => {
  const router = Router();
  router.get('/', listClients(store));
  router.get('/:clientId', getClient(store));
  router.post('/', requireBody, createClient(store));
  router.put('/:clientId', requireBody, updateClient(store));
  router.delete('/:clientId', deleteClient(store));
  return router;
};
