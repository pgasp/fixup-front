import React, { useMemo } from 'react';
import { Quote, RepairOrder, Client, Invoice, PurchaseOrder, Technician } from '../types';
import { UsersIcon, FileTextIcon, WrenchIcon, ReceiptTaxIcon, ShoppingCartIcon } from './icons';

interface ReportsDashboardProps {
  quotes: Quote[];
  repairOrders: RepairOrder[];
  invoices: Invoice[];
  clients: Client[];
  purchaseOrders: PurchaseOrder[];
  technicians: Technician[];
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


const getWeekStartAndEnd = (date: Date): { start: Date, end: Date } => {
    const start = new Date(date);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1); // Monday as first day
    start.setDate(diff);
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);
    
    return { start, end };
};


const ReportsDashboard: React.FC<ReportsDashboardProps> = ({ quotes, repairOrders, invoices, clients, purchaseOrders, technicians }) => {

    const weeklyActivity = useMemo(() => {
        const { start, end } = getWeekStartAndEnd(new Date());

        const isDateInWeek = (dateStr: string) => {
            const date = new Date(dateStr);
            return date >= start && date <= end;
        };
        
        const newQuotes = quotes.filter(q => isDateInWeek(q.date));
        const newInvoices = invoices.filter(i => isDateInWeek(i.date));
        const newRepairOrders = repairOrders.filter(ro => isDateInWeek(ro.quote.date)); // Assuming creation date is quote date
        const newPurchaseOrders = purchaseOrders.filter(po => isDateInWeek(po.date));

        const technicianWorkload = technicians.map(tech => ({
            ...tech,
            assignedRepairs: newRepairOrders.filter(ro => ro.technicianId === tech.id).length
        })).sort((a, b) => b.assignedRepairs - a.assignedRepairs);

        return {
            newQuotesCount: newQuotes.length,
            newInvoicesCount: newInvoices.length,
            newRepairOrdersCount: newRepairOrders.length,
            newPurchaseOrdersCount: newPurchaseOrders.length,
            technicianWorkload,
        }

    }, [quotes, repairOrders, invoices, purchaseOrders, technicians]);
    

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Activité de la semaine</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Nouveaux Devis" value={weeklyActivity.newQuotesCount} icon={<FileTextIcon className="h-6 w-6 text-blue-600 dark:text-blue-400"/>} />
                <StatCard title="Nouvelles Réparations" value={weeklyActivity.newRepairOrdersCount} icon={<WrenchIcon className="h-6 w-6 text-blue-600 dark:text-blue-400"/>} />
                <StatCard title="Factures Émises" value={weeklyActivity.newInvoicesCount} icon={<ReceiptTaxIcon className="h-6 w-6 text-blue-600 dark:text-blue-400"/>} />
                <StatCard title="Nouvelles Commandes" value={weeklyActivity.newPurchaseOrdersCount} icon={<ShoppingCartIcon className="h-6 w-6 text-blue-600 dark:text-blue-400"/>} />
            </div>
            
            <div className="grid grid-cols-1 gap-6">
                 <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h3 className="font-semibold mb-4 text-gray-800 dark:text-gray-200">Charge des techniciens (semaine)</h3>
                    <ul className="space-y-3">
                        {weeklyActivity.technicianWorkload.map(tech => (
                            <li key={tech.id} className="flex justify-between items-center bg-gray-50 dark:bg-gray-700/50 p-3 rounded-md">
                                <span className="font-medium text-gray-800 dark:text-gray-200">{tech.name}</span>
                                <span className="font-bold text-blue-600 dark:text-blue-400">{tech.assignedRepairs} réparation(s)</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ReportsDashboard;
