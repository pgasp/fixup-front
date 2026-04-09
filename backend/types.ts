import {
  Appointment,
  Client,
  FinancialTransaction,
  Invoice,
  InterventionTemplate,
  Part,
  PurchaseOrder,
  Quote,
  RepairOrder,
  Settings,
  Technician,
} from '../types';

export interface AppDataStore {
  clients: Client[];
  quotes: Quote[];
  appointments: Appointment[];
  repairOrders: RepairOrder[];
  invoices: Invoice[];
  parts: Part[];
  technicians: Technician[];
  interventionTemplates: InterventionTemplate[];
  purchaseOrders: PurchaseOrder[];
  transactions: FinancialTransaction[];
  settings: Settings;
}
