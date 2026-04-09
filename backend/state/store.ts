import {
  seedAppointments,
  seedClients,
  seedFinancialTransactions,
  seedInterventionTemplates,
  seedInvoices,
  seedParts,
  seedPurchaseOrders,
  seedQuotes,
  seedRepairOrders,
  seedTechnicians,
} from '../../services/seedData';
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
    clients: structuredClone(seedClients),
    quotes: structuredClone(seedQuotes),
    appointments: structuredClone(seedAppointments),
    repairOrders: structuredClone(seedRepairOrders),
    invoices: structuredClone(seedInvoices),
    parts: structuredClone(seedParts),
    technicians: structuredClone(seedTechnicians),
    interventionTemplates: structuredClone(seedInterventionTemplates),
    purchaseOrders: structuredClone(seedPurchaseOrders),
    transactions: structuredClone(seedFinancialTransactions),
    settings: structuredClone(defaultSettings),
  };
};
