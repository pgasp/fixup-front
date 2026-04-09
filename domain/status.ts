import { ComponentType } from 'react';
import { InvoiceStatus, PurchaseOrderStatus, QuoteStatus, RepairOrderStatus } from '../types';
import {
  CalendarIcon,
  CheckCircleIcon,
  ClipboardCheckIcon,
  ClockIcon,
  CreditCardIcon,
  DocumentSearchIcon,
  FileTextIcon,
  PaperPlaneIcon,
  ReceiptTaxIcon,
  TrashIcon,
  TruckIcon,
  WrenchIcon,
  XIcon,
} from '../components/icons';

type StatusBadgeConfig = {
  text: string;
  color: string;
  icon?: ComponentType<{ className?: string }>;
};

type StatusLifecycleConfig = {
  text: string;
  color: string;
  icon: ComponentType<{ className?: string }>;
};

export const quoteStatusBadgeConfig: Record<QuoteStatus, StatusBadgeConfig> = {
  draft: { text: 'Brouillon', color: 'text-gray-500 bg-gray-100 dark:text-gray-400 dark:bg-gray-700', icon: FileTextIcon },
  ready_to_send: { text: 'Pret pour envoi', color: 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/50', icon: ClipboardCheckIcon },
  awaiting_part_pricing: { text: 'Attente cotation', color: 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/50', icon: ClockIcon },
  sent: { text: 'Envoye', color: 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/50', icon: PaperPlaneIcon },
  approved: { text: 'Approuve', color: 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/50', icon: CheckCircleIcon },
  rejected: { text: 'Rejete', color: 'text-red-500 bg-red-100 dark:text-red-400 dark:bg-red-900/50', icon: XIcon },
};

export const quoteStatusLifecycleConfig: Record<QuoteStatus, StatusLifecycleConfig> = {
  draft: { text: 'Brouillon', icon: FileTextIcon, color: 'text-gray-500 dark:text-gray-400' },
  awaiting_part_pricing: { text: 'Attente Cotation', icon: ClockIcon, color: 'text-orange-500 dark:text-orange-400' },
  ready_to_send: { text: 'Valide', icon: ClipboardCheckIcon, color: 'text-purple-500 dark:text-purple-400' },
  sent: { text: 'Envoye', icon: PaperPlaneIcon, color: 'text-blue-500 dark:text-blue-400' },
  approved: { text: 'Approuve', icon: CheckCircleIcon, color: 'text-green-500 dark:text-green-400' },
  rejected: { text: 'Rejete', icon: XIcon, color: 'text-red-500 dark:text-red-400' },
};

export const repairOrderStatusBadgeConfig: Record<RepairOrderStatus, StatusBadgeConfig> = {
  scheduled: { text: 'Programme', color: 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-700', icon: CalendarIcon },
  workshop_entry: { text: 'Entree Atelier', color: 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/50', icon: ClipboardCheckIcon },
  diagnosis_complete: { text: 'Diagnostic Termine', color: 'text-indigo-600 bg-indigo-100 dark:text-indigo-400 dark:bg-indigo-900/50', icon: DocumentSearchIcon },
  in_progress: { text: 'En Cours', color: 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/50', icon: WrenchIcon },
  waiting_for_part: { text: 'Attente Piece', color: 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/50', icon: ClockIcon },
  completed: { text: 'Terminee', color: 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/50', icon: CheckCircleIcon },
  waiting_for_invoicing: { text: 'A Facturer', color: 'text-teal-600 bg-teal-100 dark:text-teal-400 dark:bg-teal-900/50', icon: ReceiptTaxIcon },
  invoiced: { text: 'Facturee', color: 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/50', icon: ReceiptTaxIcon },
  cancelled: { text: 'Annulee', color: 'text-red-500 bg-red-100 dark:text-red-400 dark:bg-red-900/50', icon: TrashIcon },
};

export const repairOrderStatusLifecycleConfig: Record<RepairOrderStatus, StatusLifecycleConfig> = {
  scheduled: { text: 'Programme', icon: CalendarIcon, color: 'text-gray-500 dark:text-gray-400' },
  workshop_entry: { text: 'Entree Atelier', icon: ClipboardCheckIcon, color: 'text-blue-500 dark:text-blue-400' },
  diagnosis_complete: { text: 'Diagnostic Termine', icon: DocumentSearchIcon, color: 'text-indigo-500 dark:text-indigo-400' },
  in_progress: { text: 'En Cours', icon: WrenchIcon, color: 'text-yellow-500 dark:text-yellow-400' },
  waiting_for_part: { text: 'En Attente de Piece', icon: ClockIcon, color: 'text-orange-500 dark:text-orange-400' },
  completed: { text: 'Terminee', icon: CheckCircleIcon, color: 'text-green-500 dark:text-green-400' },
  waiting_for_invoicing: { text: 'Facturation en attente', icon: ReceiptTaxIcon, color: 'text-teal-500 dark:text-teal-400' },
  invoiced: { text: 'Facturee', icon: ReceiptTaxIcon, color: 'text-purple-500 dark:text-purple-400' },
  cancelled: { text: 'Annulee', icon: TrashIcon, color: 'text-red-500 dark:text-red-400' },
};

export const invoiceStatusBadgeConfig: Record<InvoiceStatus, StatusBadgeConfig> = {
  draft: { text: 'En attente de paiement', color: 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/50', icon: ClockIcon },
  paid: { text: 'Payee', color: 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/50', icon: CreditCardIcon },
  cancelled: { text: 'Annulee', color: 'text-red-500 bg-red-100 dark:text-red-400 dark:bg-red-900/50', icon: TrashIcon },
};

export const purchaseOrderStatusBadgeConfig: Record<PurchaseOrderStatus, StatusBadgeConfig> = {
  draft: { text: 'Brouillon', color: 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-700', icon: FileTextIcon },
  ordered: { text: 'Commande', color: 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/50', icon: ClockIcon },
  in_delivery: {
    text: 'En cours de livraison',
    color: 'text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-900/50',
    icon: TruckIcon,
  },
  partially_received: { text: 'Partiellement Recu', color: 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/50', icon: TruckIcon },
  received: { text: 'Recu', color: 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/50', icon: CheckCircleIcon },
  cancelled: { text: 'Annule', color: 'text-red-500 bg-red-100 dark:text-red-400 dark:bg-red-900/50', icon: TrashIcon },
};
