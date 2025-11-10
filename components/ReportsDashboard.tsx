import React, { useMemo } from 'react';
import { Quote, RepairOrder, Client, QuoteStatus, Invoice } from '../types';
import { UsersIcon, FileTextIcon, WrenchIcon, CheckCircleIcon, ReceiptTaxIcon } from './icons';

interface ReportsDashboardProps {
  quotes: Quote[];
  repairOrders: RepairOrder[];
  invoices: Invoice[];
  clients: Client[];
}

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg flex items-center space-x-4">
        <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-full">
            {icon}
        </div>
        <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
    </div>
);

const BarChart: React.FC<{ data: { label: string, value: number, color: string }[] }> = ({ data }) => {
    const maxValue = Math.max(...data.map(d => d.value), 1); // Avoid division by zero
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="font-semibold mb-4 text-gray-800 dark:text-gray-200">Répartition des Devis par Statut</h3>
            <div className="space-y-2">
                {data.map(({ label, value, color }) => (
                    <div key={label} className="flex items-center">
                        <span className="w-24 text-sm text-gray-600 dark:text-gray-400">{label}</span>
                        <div className="flex-grow bg-gray-200 dark:bg-gray-700 rounded-full h-6">
                            <div
                                className={`${color} h-6 rounded-full flex items-center justify-end pr-2 text-white font-bold text-xs`}
                                style={{ width: `${(value / maxValue) * 100}%` }}
                            >
                                {value > 0 ? value : ''}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const calculateTotal = (quote: Quote) => {
    const subtotal = quote.laborItems.reduce((sum, labor) => {
        const laborCost = labor.hours * labor.rate;
        const partsCost = labor.partItems.reduce((pAcc, part) => pAcc + (part.quantity * part.unitPrice), 0);
        return sum + laborCost + partsCost;
    }, 0);
    return subtotal * (1 + quote.taxRate / 100);
}

const ReportsDashboard: React.FC<ReportsDashboardProps> = ({ quotes, repairOrders, invoices, clients }) => {

    const potentialRevenue = useMemo(() => {
        const total = quotes.reduce((acc, quote) => {
            if (quote.status === 'approved') {
                return acc + calculateTotal(quote);
            }
            return acc;
        }, 0);
        return total.toFixed(2) + '€';
    }, [quotes]);

    const collectedRevenue = useMemo(() => {
        const total = invoices.reduce((acc, invoice) => {
            if (invoice.status === 'paid') {
                return acc + calculateTotal(invoice.quote);
            }
            return acc;
        }, 0);
        return total.toFixed(2) + '€';
    }, [invoices]);
    
    const quoteStatusCounts = useMemo(() => {
        const counts: { [key in QuoteStatus]: number } = { draft: 0, sent: 0, approved: 0, rejected: 0 };
        quotes.forEach(q => {
            counts[q.status]++;
        });
        return [
            { label: 'Brouillons', value: counts.draft, color: 'bg-gray-500' },
            { label: 'Envoyés', value: counts.sent, color: 'bg-blue-500' },
            { label: 'Approuvés', value: counts.approved, color: 'bg-green-500' },
            { label: 'Rejetés', value: counts.rejected, color: 'bg-red-500' },
        ];
    }, [quotes]);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="CA Encaissé" value={collectedRevenue} icon={<ReceiptTaxIcon className="h-6 w-6 text-blue-600 dark:text-blue-400"/>} />
                <StatCard title="CA Potentiel (Devis Approuvés)" value={potentialRevenue} icon={<CheckCircleIcon className="h-6 w-6 text-blue-600 dark:text-blue-400"/>} />
                <StatCard title="Total Clients" value={clients.length} icon={<UsersIcon className="h-6 w-6 text-blue-600 dark:text-blue-400"/>} />
                <StatCard title="Réparations en cours" value={repairOrders.filter(ro => !['completed', 'waiting_for_invoicing', 'cancelled', 'invoiced'].includes(ro.status)).length} icon={<WrenchIcon className="h-6 w-6 text-blue-600 dark:text-blue-400"/>} />
            </div>
            
            <div className="grid grid-cols-1 gap-6">
                <BarChart data={quoteStatusCounts} />
            </div>
        </div>
    );
};

export default ReportsDashboard;