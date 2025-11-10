// types.ts

export interface Vehicle {
  id: string;
  licensePlate: string;
  make: string;
  model: string;
  vin?: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  postalCode: string;
  city: string;
  vehicles: Vehicle[];
}

export interface PartItem {
  id: string;
  partId: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface LaborTask {
  id: string;
  description: string;
  hours: number;
  rate: number;
  partItems: PartItem[];
}

export type QuoteStatus = 'draft' | 'sent' | 'approved' | 'rejected';

export interface QuoteStatusHistory {
  status: QuoteStatus;
  date: string;
}

export interface Quote {
  id: string;
  quoteNumber: string;
  clientId: string;
  vehicleId: string;
  date: string;
  validityDuration: number;
  taxRate: number;
  laborItems: LaborTask[];
  status: QuoteStatus;
  statusHistory: QuoteStatusHistory[];
  isConvertedToRepairOrder?: boolean;
  repairDate?: string; // used for scheduling
}

export interface InterventionTemplate {
  id: string;
  name: string;
  laborItems: Omit<LaborTask, 'id'>[];
}

export interface Part {
    id: string;
    name: string;
    reference: string;
    supplier: string;
    stock: number;
    purchasePrice: number;
    pricingMethod: 'fixed' | 'markup';
    sellingPrice?: number;
    markupPercentage?: number;
}

export interface Appointment {
  id: string;
  title: string;
  start: string;
  end: string;
  quoteId: string;
  clientId: string;
  vehicleId: string;
}

export type RepairOrderStatus = 'scheduled' | 'workshop_entry' | 'diagnosis_complete' | 'in_progress' | 'waiting_for_part' | 'completed' | 'waiting_for_invoicing' | 'invoiced' | 'cancelled';

export interface VehicleInspectionItem {
  id: string;
  description: string;
  photo: string;
}
export interface VehicleInspectionReport {
  id: string;
  items: VehicleInspectionItem[];
  notes: string;
}

export interface RepairOrder {
  id: string;
  quote: Quote;
  status: RepairOrderStatus;
  technicianId?: string;
  inspectionReport?: VehicleInspectionReport;
  notes?: string;
}

export type InvoiceStatus = 'draft' | 'paid' | 'cancelled';

export interface PaymentDetails {
    date: string;
    method: 'card' | 'cash' | 'transfer' | 'other';
}

export interface Invoice {
    id: string;
    invoiceNumber: string;
    quote: Quote;
    date: string;
    dueDate: string;
    status: InvoiceStatus;
    paymentDetails?: PaymentDetails;
}

export interface Technician {
    id: string;
    name: string;
    specialty?: string;
    email?: string;
    phone?: string;
    hireDate?: string;
}

export type PurchaseOrderStatus = 'draft' | 'ordered' | 'partially_received' | 'received' | 'cancelled';

export interface PurchaseOrderItem {
    id: string;
    partId: string;
    quantity: number;
    unitPrice: number;
}

export interface PurchaseOrder {
    id: string;
    orderNumber: string;
    supplier: string;
    date: string;
    expectedDeliveryDate?: string;
    status: PurchaseOrderStatus;
    items: PurchaseOrderItem[];
    isPaid?: boolean;
    paymentDate?: string;
}

export type FinancialTransactionType = 'revenue' | 'expense';

export interface FinancialTransaction {
  id: string;
  date: string;
  type: FinancialTransactionType;
  amount: number;
  description: string;
  referenceId: string; // ID of invoice or purchase order
}
