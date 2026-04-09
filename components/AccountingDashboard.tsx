import React, { useState, useMemo } from 'react';
import { Invoice, PurchaseOrder } from '../types';
import { ChartBarIcon, CreditCardIcon, ShoppingCartIcon, WalletIcon } from './icons';
import { calculateInvoiceTotal, calculatePurchaseOrderTotal } from '../domain/financial';

interface AccountingDashboardProps {
  invoices: Invoice[];
  purchaseOrders: PurchaseOrder[];
}

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{title}</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-full">
                {icon}
            </div>
        </div>
    </div>
);

const getPeriodDateRange = (period: string): { start: Date, end: Date } => {
    const now = new Date();
    let start = new Date();
    let end = new Date();
    now.setHours(0, 0, 0, 0);
    
    switch (period) {
        case 'this_week':
            const firstDayOfWeek = now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1); // Monday as first day
            start = new Date(now.setDate(firstDayOfWeek));
            end = new Date(start);
            end.setDate(end.getDate() + 6);
            break;
        case 'this_month':
            start = new Date(now.getFullYear(), now.getMonth(), 1);
            end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
            break;
        case 'this_year':
            start = new Date(now.getFullYear(), 0, 1);
            end = new Date(now.getFullYear(), 11, 31);
            break;
    }
    end.setHours(23, 59, 59, 999);
    return { start, end };
};

const FinancialChart: React.FC<{data: {label: string, revenue: number, expenses: number}[]}> = ({ data }) => {
    const maxValue = useMemo(() => {
        if (!data || data.length === 0) return 1;
        const max = Math.max(...data.map(d => Math.max(d.revenue, d.expenses)));
        const paddedMax = max * 1.1; // Add 10% padding to the top
        return paddedMax === 0 ? 1 : paddedMax;
    }, [data]);
    
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg h-96 flex flex-col">
            <h3 className="font-semibold text-lg mb-4">Performance Annuelle (Année en cours)</h3>
            <div className="flex-grow flex gap-1 items-end border-b border-l border-gray-200 dark:border-gray-700 pb-1 pl-1 relative">
                {/* Y-axis labels */}
                <div className="absolute -top-2 -left-1 text-[10px] text-gray-400 h-full flex flex-col justify-between pr-2 text-right w-full pointer-events-none">
                    <div className="w-full flex justify-between items-center">
                        <span>{Math.round(maxValue).toLocaleString()}€</span>
                        <div className="flex-grow border-t border-dashed border-gray-200 dark:border-gray-700 ml-2"></div>
                    </div>
                     <div className="w-full flex justify-between items-center">
                        <span>0€</span>
                        <div className="flex-grow border-t border-gray-200 dark:border-gray-700 ml-2"></div>
                    </div>
                </div>
                {data.map((d, i) => {
                    const showLabel = data.length <= 15 || i % Math.ceil(data.length / 12) === 0;
                    return (
                        <div key={i} className="flex-1 h-full flex flex-col items-center justify-end text-center">
                            <div className="flex items-end h-full w-full gap-px justify-center">
                                <div className="w-1/2 bg-green-300 dark:bg-green-700 rounded-t-md hover:bg-green-400 dark:hover:bg-green-600 transition-colors relative group" style={{ height: `${(d.revenue / maxValue) * 100}%` }}>
                                    <div className="absolute bottom-full mb-2 w-max px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap left-1/2 -translate-x-1/2 z-10 pointer-events-none">
                                        Revenus: {d.revenue.toFixed(2)}€
                                    </div>
                                </div>
                                <div className="w-1/2 bg-red-300 dark:bg-red-700 rounded-t-md hover:bg-red-400 dark:hover:bg-red-600 transition-colors relative group" style={{ height: `${(d.expenses / maxValue) * 100}%` }}>
                                     <div className="absolute bottom-full mb-2 w-max px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap left-1/2 -translate-x-1/2 z-10 pointer-events-none">
                                        Dépenses: {d.expenses.toFixed(2)}€
                                    </div>
                                </div>
                            </div>
                            {showLabel && <span className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">{d.label}</span>}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};


const AccountingDashboard: React.FC<AccountingDashboardProps> = ({ invoices, purchaseOrders }) => {
    const [period, setPeriod] = useState('this_month');
    const [customStartDate, setCustomStartDate] = useState('');
    const [customEndDate, setCustomEndDate] = useState('');

    const dateRange = useMemo(() => {
        if (period === 'custom' && customStartDate && customEndDate) {
            const start = new Date(customStartDate);
            const end = new Date(customEndDate);
            start.setHours(0, 0, 0, 0);
            end.setHours(23, 59, 59, 999);
            return { start, end };
        }
        return getPeriodDateRange(period);
    }, [period, customStartDate, customEndDate]);

    const yearlyChartData = useMemo(() => {
        const currentYear = new Date().getFullYear();
        const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
        const data = months.map(m => ({ label: m, revenue: 0, expenses: 0 }));

        invoices.forEach(inv => {
            if (inv.status === 'paid' && inv.paymentDetails) {
                const paymentDate = new Date(inv.paymentDetails.date);
                if (paymentDate.getFullYear() === currentYear) {
                    const monthIndex = paymentDate.getMonth();
                    data[monthIndex].revenue += calculateInvoiceTotal(inv);
                }
            }
        });

        purchaseOrders.forEach(po => {
            if (po.isPaid && po.paymentDate) {
                const paymentDate = new Date(po.paymentDate);
                if (paymentDate.getFullYear() === currentYear) {
                    const monthIndex = paymentDate.getMonth();
                    data[monthIndex].expenses += calculatePurchaseOrderTotal(po);
                }
            }
        });

        return data;
    }, [invoices, purchaseOrders]);

    const periodFinancialData = useMemo(() => {
        const { start, end } = dateRange;

        const paidInvoices = invoices.filter(inv => {
            if (inv.status !== 'paid' || !inv.paymentDetails) return false;
            const paymentDate = new Date(inv.paymentDetails.date);
            return paymentDate >= start && paymentDate <= end;
        });

        const paidOrders = purchaseOrders.filter(po => {
            if (!po.isPaid || !po.paymentDate) return false;
            const paymentDate = new Date(po.paymentDate);
            return paymentDate >= start && paymentDate <= end;
        });

        const revenue = paidInvoices.reduce((sum, inv) => sum + calculateInvoiceTotal(inv), 0);
        const expenses = paidOrders.reduce((sum, po) => sum + calculatePurchaseOrderTotal(po), 0);
        const profit = revenue - expenses;
        const avgInvoice = paidInvoices.length > 0 ? revenue / paidInvoices.length : 0;
        
        const transactions = [
            ...paidInvoices.map(inv => ({ type: 'revenue' as const, date: new Date(inv.paymentDetails!.date), amount: calculateInvoiceTotal(inv), description: `Facture ${inv.invoiceNumber}` })),
            ...paidOrders.map(po => ({ type: 'expense' as const, date: new Date(po.paymentDate!), amount: calculatePurchaseOrderTotal(po), description: `Commande ${po.orderNumber}` })),
        ].sort((a, b) => b.date.getTime() - a.date.getTime());

        return { revenue, expenses, profit, avgInvoice, transactions };

    }, [invoices, purchaseOrders, dateRange]);


    const periodOptions = [
        { value: 'this_week', label: 'Cette semaine' },
        { value: 'this_month', label: 'Ce mois-ci' },
        { value: 'this_year', label: 'Cette année' },
        { value: 'custom', label: 'Personnalisé' },
    ];
    
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
                <FinancialChart data={yearlyChartData} />
            </div>

            <hr className="border-gray-200 dark:border-gray-700"/>

            <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">Analyse de la période</h3>
                <div className="flex flex-wrap items-center gap-2 mb-6">
                    {periodOptions.map(opt => (
                        <button key={opt.value} onClick={() => setPeriod(opt.value)} className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-colors ${period === opt.value ? 'bg-blue-600 text-white shadow-md' : 'bg-white dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>{opt.label}</button>
                    ))}
                    {period === 'custom' && (
                        <div className="flex items-center gap-2 p-2 bg-gray-200 dark:bg-gray-700/50 rounded-lg">
                            <input type="date" value={customStartDate} onChange={e => setCustomStartDate(e.target.value)} className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded-md text-sm p-1"/>
                            <span className="font-semibold">à</span>
                            <input type="date" value={customEndDate} onChange={e => setCustomEndDate(e.target.value)} className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded-md text-sm p-1"/>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                     <StatCard title="CA Encaissé (période)" value={`${periodFinancialData.revenue.toFixed(2)}€`} icon={<CreditCardIcon className="h-6 w-6 text-green-600 dark:text-green-400"/>} />
                     <StatCard title="Dépenses (période)" value={`${periodFinancialData.expenses.toFixed(2)}€`} icon={<ShoppingCartIcon className="h-6 w-6 text-red-500 dark:text-red-400"/>} />
                     <StatCard title="Bénéfice (période)" value={`${periodFinancialData.profit.toFixed(2)}€`} icon={<WalletIcon className="h-6 w-6 text-blue-600 dark:text-blue-400"/>} />
                     <StatCard title="Panier Moyen (période)" value={`${periodFinancialData.avgInvoice.toFixed(2)}€`} icon={<ChartBarIcon className="h-6 w-6 text-indigo-500 dark:text-indigo-400"/>} />
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                <h3 className="font-semibold text-lg mb-4">Transactions Récentes (période)</h3>
                <ul className="space-y-3 max-h-80 overflow-y-auto">
                    {periodFinancialData.transactions.length > 0 ? periodFinancialData.transactions.map((t, i) => (
                        <li key={i} className="flex justify-between items-center text-sm">
                            <div>
                                <p className="font-semibold">{t.description}</p>
                                <p className="text-xs text-gray-500">{t.date.toLocaleDateString()}</p>
                            </div>
                            <span className={`font-mono font-semibold ${t.type === 'revenue' ? 'text-green-600' : 'text-red-500'}`}>
                                {t.type === 'revenue' ? '+' : '-'}{t.amount.toFixed(2)}€
                            </span>
                        </li>
                    )) : <p className="text-sm text-gray-500 text-center pt-8">Aucune transaction pour cette période.</p>}
                </ul>
            </div>
        </div>
    );
};

export default AccountingDashboard;
