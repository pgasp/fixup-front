import { Request, Response } from 'express';
import { HttpError } from '../errors';
import { AppDataStore } from '../types';

export const listClients = (store: AppDataStore) => (_req: Request, res: Response): void => {
  res.json(store.clients);
};

export const getClient = (store: AppDataStore) => (req: Request, res: Response): void => {
  const client = store.clients.find((item) => item.id === req.params.clientId);
  if (!client) {
    throw new HttpError(404, 'Client not found');
  }
  res.json(client);
};

export const createClient = (store: AppDataStore) => (req: Request, res: Response): void => {
  const payload = req.body;
  const client = { ...payload, id: crypto.randomUUID() };
  store.clients.push(client);
  res.status(201).json(client);
};

export const updateClient = (store: AppDataStore) => (req: Request, res: Response): void => {
  const index = store.clients.findIndex((item) => item.id === req.params.clientId);
  if (index === -1) {
    throw new HttpError(404, 'Client not found');
  }
  const updatedClient = { ...req.body, id: req.params.clientId };
  store.clients[index] = updatedClient;
  res.json(updatedClient);
};

export const deleteClient = (store: AppDataStore) => (req: Request, res: Response): void => {
  const index = store.clients.findIndex((item) => item.id === req.params.clientId);
  if (index === -1) {
    throw new HttpError(404, 'Client not found');
  }
  store.clients.splice(index, 1);
  res.status(204).send();
};
