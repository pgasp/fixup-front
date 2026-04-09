import { AppDataStore } from '../types';

export interface EntityRepository<T extends { id: string }> {
  list(): T[];
  findById(id: string): T | undefined;
  create(entity: T): T;
  update(id: string, entity: T): T | undefined;
  delete(id: string): boolean;
}

export interface BackendRepositories {
  clients: EntityRepository<AppDataStore['clients'][number]>;
  quotes: EntityRepository<AppDataStore['quotes'][number]>;
  repairOrders: EntityRepository<AppDataStore['repairOrders'][number]>;
  invoices: EntityRepository<AppDataStore['invoices'][number]>;
}
