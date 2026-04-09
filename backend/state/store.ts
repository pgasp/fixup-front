import { Settings } from '../../types';
import { AppDataStore } from '../types';

const defaultSettings: Settings = {
  garageName: 'FixUp',
  address: '1 Rue de la Republique',
  postalCode: '75001',
  city: 'Paris',
  phone: '0123456789',
  email: 'contact@fixup.com',
  logo: '',
};

export const createInitialStore = (): AppDataStore => {
  return {
    clients: [],
    quotes: [],
    appointments: [],
    repairOrders: [],
    invoices: [],
    parts: [],
    technicians: [],
    interventionTemplates: [],
    purchaseOrders: [],
    transactions: [],
    settings: structuredClone(defaultSettings),
  };
};
