import React, { useMemo } from 'react';
import { Invoice, PurchaseOrder, Quote } from '../types';
import { ReceiptTaxIcon, CreditCardIcon, ShoppingCartIcon } from './icons';

interface AccountingDashboardProps {
  invoices: Invoice[];
  purchaseOrders: PurchaseOrder[];
  quotes: Quote[];
}

const StatCard: React.FC<{ title: string; value: string | number; description: string; icon: React.ReactNode }> = ({ title, value, description, icon }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{title}</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{description}</p>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-full">
                {icon}
            </div>
        </div>
    </div>
);

const AccountingDashboard: React.FC<AccountingDashboardProps> = ({ invoices, purchaseOrders, quotes }) => {

    const calculateTotal = (items: { quantity: number; unitPrice: number }[], taxRate = 0) => {
        const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
        return subtotal * (1 + taxRate / 100);
    };

    const revenueData = useMemo(() => {
        const collected = invoices
            .filter(inv => inv.status === 'paid')
            .reduce((sum, inv) => sum + calculateTotal(inv.quote.laborItems.flatMap(l => [{ quantity: l.hours, unitPrice: l.rate }, ...l.partItems]), inv.quote.taxRate), 0);

        const pending = invoices
            .filter(inv => inv.status === 'draft')
            .reduce((sum, inv) => sum + calculateTotal(inv.quote.laborItems.flatMap(l => [{ quantity: l.hours, unitPrice: l.rate }, ...l.partItems]), inv.quote.taxRate), 0);
        
        return { collected, pending };
    }, [invoices]);

    const expenseData = useMemo(() => {
        const total = purchaseOrders
            .filter(po => po.status === 'received')
            .reduce((sum, po) => sum + calculateTotal(po.items), 0);
        return { total };
    }, [purchaseOrders]);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard 
                    title="Chiffre d'Affaires Encaissé" 
                    value={`${revenueData.collected.toFixed(2)}€`}
                    description="Total des factures payées."
                    icon={<ReceiptTaxIcon className="h-6 w-6 text-blue-600 dark:text-blue-400"/>} 
                />
                <StatCard 
                    title="Paiements en Attente" 
                    value={`${revenueData.pending.toFixed(2)}€`}
                    description="Total des factures non-payées."
                    icon={<CreditCardIcon className="h-6 w-6 text-blue-600 dark:text-blue-400"/>} 
                />
                <StatCard 
                    title="Dépenses (Achats)" 
                    value={`${expenseData.total.toFixed(2)}€`}
                    description="Total des commandes fournisseurs reçues."
                    icon={<ShoppingCartIcon className="h-6 w-6 text-blue-600 dark:text-blue-400"/>} 
                />
            </div>
        </div>
    );
};

export default AccountingDashboard;
