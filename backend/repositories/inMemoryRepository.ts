import { AppDataStore } from '../types';
import { BackendRepositories, EntityRepository } from './interfaces';

class InMemoryEntityRepository<T extends { id: string }> implements EntityRepository<T> {
  constructor(private readonly getCollection: () => T[]) {}

  list(): T[] {
    return this.getCollection();
  }

  findById(id: string): T | undefined {
    return this.getCollection().find((item) => item.id === id);
  }

  create(entity: T): T {
    this.getCollection().push(entity);
    return entity;
  }

  update(id: string, entity: T): T | undefined {
    const collection = this.getCollection();
    const index = collection.findIndex((item) => item.id === id);
    if (index === -1) {
      return undefined;
    }
    collection[index] = entity;
    return collection[index];
  }

  delete(id: string): boolean {
    const collection = this.getCollection();
    const index = collection.findIndex((item) => item.id === id);
    if (index === -1) {
      return false;
    }
    collection.splice(index, 1);
    return true;
  }
}

export const createInMemoryRepositories = (store: AppDataStore): BackendRepositories => {
  return {
    clients: new InMemoryEntityRepository(() => store.clients),
    quotes: new InMemoryEntityRepository(() => store.quotes),
    repairOrders: new InMemoryEntityRepository(() => store.repairOrders),
    invoices: new InMemoryEntityRepository(() => store.invoices),
  };
};
