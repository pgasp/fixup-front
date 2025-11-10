import React, { useState, useMemo } from 'react';
import { Client, Quote, InterventionTemplate, Part, Appointment, RepairOrder, VehicleInspectionReport, Invoice, PaymentDetails, Technician, PurchaseOrder, FinancialTransaction, PurchaseOrderItem } from './types';
import useLocalStorage from './hooks/useLocalStorage';
import { seedClients, seedInterventionTemplates, seedParts, seedTechnicians, seedPurchaseOrders, seedQuotes, seedAppointments, seedRepairOrders, seedInvoices, seedFinancialTransactions } from './services/seedData';
// FIX: Import missing icons `UserCircleIcon` and `PlusIcon`.
import { FileTextIcon, UsersIcon, WrenchScrewdriverIcon, WrenchIcon, CalendarIcon, ReceiptTaxIcon, ShoppingCartIcon, ChartBarIcon, CogIcon, SunIcon, MoonIcon, BoxIcon, WalletIcon, BookOpenIcon, ChevronDownIcon, TruckIcon, UserCircleIcon, PlusIcon } from './components/icons';

// Import Components
import ClientList from './components/ClientList';
import ClientForm from './components/ClientForm';
import ConfirmationModal from './components/ConfirmationModal';
import QuoteList from './components/QuoteList';
import QuoteForm from './components/QuoteForm';
import Modal from './components/Modal';
import QuoteView from './components/QuoteView';
import StatusChangeModal from './components/StatusChangeModal';
import AppointmentForm from './components/AppointmentForm';
import Scheduler from './components/Scheduler';
import InterventionTemplateList from './components/InterventionTemplateList';
import InterventionTemplateForm from './components/InterventionTemplateForm';
import PartList from './components/PartList';
import PartForm from './components/PartForm';
import RepairOrderList from './components/RepairOrderList';
import RepairOrderView from './components/RepairOrderView';
import VehicleInspectionForm from './components/VehicleInspectionForm';
import InvoiceList from './components/InvoiceList';
import InvoiceView from './components/InvoiceView';
import PaymentForm from './components/PaymentForm';
import TechnicianList from './components/TechnicianList';
import TechnicianForm from './components/TechnicianForm';
import PurchaseOrderList from './components/PurchaseOrderList';
import PurchaseOrderForm from './components/PurchaseOrderForm';
import ReportsDashboard from './components/ReportsDashboard';
import AccountingDashboard from './components/AccountingDashboard';
import PurchaseOrderPaymentForm from './components/PurchaseOrderPaymentForm';


type View = 'dashboard' | 'quotes' | 'clients' | 'invoices' | 'repairs' | 'scheduler' | 'stock' | 'purchases' | 'technicians' | 'templates' | 'accounting' | 'settings';

const App: React.FC = () => {
    const [view, setView] = useState<View>('dashboard');
    const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('theme', 'light');

    // State Management using useLocalStorage hook
    const [clients, setClients] = useLocalStorage<Client[]>('clients', seedClients);
    const [quotes, setQuotes] = useLocalStorage<Quote[]>('quotes', seedQuotes);
    const [interventionTemplates, setInterventionTemplates] = useLocalStorage<InterventionTemplate[]>('interventionTemplates', seedInterventionTemplates);
    const [parts, setParts] = useLocalStorage<Part[]>('parts', seedParts);
    const [appointments, setAppointments] = useLocalStorage<Appointment[]>('appointments', seedAppointments);
    const [repairOrders, setRepairOrders] = useLocalStorage<RepairOrder[]>('repairOrders', seedRepairOrders);
    const [invoices, setInvoices] = useLocalStorage<Invoice[]>('invoices', seedInvoices);
    const [technicians, setTechnicians] = useLocalStorage<Technician[]>('technicians', seedTechnicians);
    const [purchaseOrders, setPurchaseOrders] = useLocalStorage<PurchaseOrder[]>('purchaseOrders', seedPurchaseOrders);
    const [transactions, setTransactions] = useLocalStorage<FinancialTransaction[]>('financialTransactions', seedFinancialTransactions);
    const [openNavs, setOpenNavs] = useLocalStorage<string[]>('openNavs', ['atelier', 'gestionClient']);


    // Modal States
    const [isClientFormOpen, setIsClientFormOpen] = useState(false);
    const [editingClient, setEditingClient] = useState<Client | null>(null);
    const [clientToDelete, setClientToDelete] = useState<string | null>(null);

    const [isQuoteFormOpen, setIsQuoteFormOpen] = useState(false);
    const [editingQuote, setEditingQuote] = useState<Quote | null>(null);
    const [quoteToDelete, setQuoteToDelete] = useState<string | null>(null);
    const [quoteToView, setQuoteToView] = useState<Quote | null>(null);
    const [quoteForStatusChange, setQuoteForStatusChange] = useState<Quote | null>(null);
    
    const [quoteToSchedule, setQuoteToSchedule] = useState<Quote | null>(null);
    const [isAppointmentFormOpen, setIsAppointmentFormOpen] = useState(false);

    const [isTemplateFormOpen, setIsTemplateFormOpen] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState<InterventionTemplate | null>(null);
    const [templateToDelete, setTemplateToDelete] = useState<string | null>(null);

    const [isPartFormOpen, setIsPartFormOpen] = useState(false);
    const [editingPart, setEditingPart] = useState<Part | null>(null);
    const [partToDelete, setPartToDelete] = useState<string | null>(null);
    
    const [repairOrderToView, setRepairOrderToView] = useState<RepairOrder | null>(null);
    const [repairOrderToDelete, setRepairOrderToDelete] = useState<string | null>(null);
    const [inspectionForRepairOrder, setInspectionForRepairOrder] = useState<string|null>(null);
    
    const [invoiceToView, setInvoiceToView] = useState<Invoice | null>(null);
    const [invoiceToDelete, setInvoiceToDelete] = useState<string | null>(null);
    const [invoiceForPayment, setInvoiceForPayment] = useState<Invoice | null>(null);

    const [isTechnicianFormOpen, setIsTechnicianFormOpen] = useState(false);
    const [editingTechnician, setEditingTechnician] = useState<Technician | null>(null);
    const [technicianToDelete, setTechnicianToDelete] = useState<string | null>(null);

    const [isPurchaseOrderFormOpen, setIsPurchaseOrderFormOpen] = useState(false);
    const [editingPurchaseOrder, setEditingPurchaseOrder] = useState<PurchaseOrder | null>(null);
    const [purchaseOrderToDelete, setPurchaseOrderToDelete] = useState<string | null>(null);
    const [purchaseOrderForPayment, setPurchaseOrderForPayment] = useState<PurchaseOrder | null>(null);

    React.useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
    }, [theme]);

    const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

    // CRUD Handlers
    const handleSaveClient = (client: Client) => {
        setClients(prev => {
            const index = prev.findIndex(c => c.id === client.id);
            if (index > -1) {
                const newClients = [...prev];
                newClients[index] = client;
                return newClients;
            }
            return [...prev, client];
        });
        setIsClientFormOpen(false);
    };
    
    const handleSaveQuote = (quote: Quote) => {
        setQuotes(prev => {
            const index = prev.findIndex(q => q.id === quote.id);
            if(index > -1) {
                const newQuotes = [...prev];
                newQuotes[index] = quote;
                return newQuotes;
            }
            return [...prev, quote];
        });
        setIsQuoteFormOpen(false);
    };

    const handleSaveTemplate = (template: InterventionTemplate) => {
        setInterventionTemplates(prev => {
            const index = prev.findIndex(t => t.id === template.id);
            if (index > -1) {
                const newTemplates = [...prev];
                newTemplates[index] = template;
                return newTemplates;
            }
            return [...prev, template];
        });
        setIsTemplateFormOpen(false);
    };
    
    const handleSavePart = (part: Part) => {
        setParts(prev => {
            const index = prev.findIndex(p => p.id === part.id);
            if(index > -1) {
                const newParts = [...prev];
                newParts[index] = part;
                return newParts;
            }
            return [...prev, part];
        });
        setIsPartFormOpen(false);
    };

    const handleSaveAppointment = (appointment: Omit<Appointment, 'id'>) => {
        const newAppointment: Appointment = { ...appointment, id: crypto.randomUUID() };
        setAppointments(prev => [...prev, newAppointment]);
        setIsAppointmentFormOpen(false);
    };

    const handleSaveTechnician = (technician: Technician) => {
        setTechnicians(prev => {
            const index = prev.findIndex(t => t.id === technician.id);
            if(index > -1) {
                const newTechs = [...prev];
                newTechs[index] = technician;
                return newTechs;
            }
            return [...prev, technician];
        });
        setIsTechnicianFormOpen(false);
    };
    
    const handleSavePurchaseOrder = (order: PurchaseOrder) => {
        setPurchaseOrders(prev => {
            const index = prev.findIndex(po => po.id === order.id);
            if (index > -1) {
                const newOrders = [...prev];
                newOrders[index] = order;
                return newOrders;
            }
            return [...prev, order];
        });
        setIsPurchaseOrderFormOpen(false);
    };

    const handleReceivePurchaseOrder = (orderId: string) => {
        const order = purchaseOrders.find(po => po.id === orderId);
        if(!order || order.status !== 'ordered') return;

        setParts(currentParts => {
            const newParts = [...currentParts];
            order.items.forEach(item => {
                const partIndex = newParts.findIndex(p => p.id === item.partId);
                if (partIndex > -1) {
                    newParts[partIndex].stock += item.quantity;
                }
            });
            return newParts;
        });

        setPurchaseOrders(currentOrders => 
            currentOrders.map(po => po.id === orderId ? { ...po, status: 'received' } : po)
        );
    };
    
    const handleSavePurchaseOrderPayment = (details: {date: string}) => {
        if(!purchaseOrderForPayment) return;
        
        const updatedOrder = { ...purchaseOrderForPayment, isPaid: true, paymentDate: details.date, status: 'received' as const };
        
        setPurchaseOrders(prev => prev.map(po => po.id === purchaseOrderForPayment.id ? updatedOrder : po));

        const total = updatedOrder.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
        const newTransaction: FinancialTransaction = {
            id: crypto.randomUUID(),
            date: details.date,
            type: 'expense',
            amount: -total,
            description: `Paiement commande ${updatedOrder.orderNumber} (${updatedOrder.supplier})`,
            referenceId: updatedOrder.id,
        };
        setTransactions(prev => [...prev, newTransaction]);

        setPurchaseOrderForPayment(null);
    };

    const handleUpdateRepairStatus = (orderId: string, status: RepairOrder['status']) => {
        const order = repairOrders.find(ro => ro.id === orderId);
        if(!order) return;

        // Déstockage
        if ((status === 'completed' || status === 'invoiced') && !['completed', 'invoiced'].includes(order.status)) {
             setParts(currentParts => {
                const newParts = [...currentParts];
                order.quote.laborItems.forEach(labor => {
                    labor.partItems.forEach(partItem => {
                        const partIndex = newParts.findIndex(p => p.id === partItem.partId);
                        if(partIndex > -1) {
                            newParts[partIndex].stock -= partItem.quantity;
                        }
                    });
                });
                return newParts;
            });
        }
        setRepairOrders(prev => prev.map(ro => ro.id === orderId ? {...ro, status} : ro));
    };

    // Derived values
    const nextQuoteNumber = useMemo(() => {
        const lastNumber = quotes.reduce((max, q) => {
            const num = parseInt(q.quoteNumber.replace('DEV-', ''), 10);
            return num > max ? num : max;
        }, 0);
        return `DEV-${(lastNumber + 1).toString().padStart(5, '0')}`;
    }, [quotes]);

    const nextPurchaseOrderNumber = useMemo(() => {
        const lastNumber = purchaseOrders.reduce((max, po) => {
            const num = parseInt(po.orderNumber.replace('CMD-', ''), 10);
            return num > max ? num : max;
        }, 0);
        return `CMD-${(lastNumber + 1).toString().padStart(5, '0')}`;
    }, [purchaseOrders]);
    
     const navConfig = {
        main: [{ id: 'dashboard', title: 'Tableau de bord', icon: ChartBarIcon, view: 'dashboard' as View }],
        groups: [
            { id: 'atelier', title: 'Atelier', icon: WrenchIcon, items: [
                { id: 'scheduler', title: "Planning", icon: CalendarIcon, view: 'scheduler' as View },
                { id: 'repairs', title: "Fiches Réparation", icon: WrenchIcon, view: 'repairs' as View },
                { id: 'technicians', title: "Techniciens", icon: UserCircleIcon, view: 'technicians' as View },
            ]},
            { id: 'gestionStock', title: 'Gestion Stock', icon: BoxIcon, items: [
                // FIX: Use 'stock' for the view type to match the `View` type definition.
                 { id: 'stock', title: "Stock", icon: BoxIcon, view: 'stock' as View },
                 { id: 'purchases', title: "Commandes", icon: TruckIcon, view: 'purchases' as View },
            ]},
            { id: 'gestionClient', title: 'Gestion Client', icon: UsersIcon, items: [
                { id: 'clients', title: "Clients", icon: UsersIcon, view: 'clients' as View },
                { id: 'quotes', title: "Devis", icon: FileTextIcon, view: 'quotes' as View },
                { id: 'invoices', title: "Factures", icon: ReceiptTaxIcon, view: 'invoices' as View },
            ]},
            { id: 'catalogue', title: 'Catalogue', icon: BookOpenIcon, items: [
                { id: 'templates', title: "Interventions", icon: WrenchScrewdriverIcon, view: 'templates' as View },
            ]},
            { id: 'accounting', title: "Comptabilité", icon: WalletIcon, items: [
                 { id: 'accounting_dashboard', title: "Grand Livre", icon: WalletIcon, view: 'accounting' as View },
            ]}
        ]
    };

    // View rendering logic
    const renderView = () => {
        switch (view) {
            case 'clients': return <ClientList clients={clients} onEdit={client => { setEditingClient(client); setIsClientFormOpen(true); }} onDelete={id => setClientToDelete(id)} />;
            case 'templates': return <InterventionTemplateList templates={interventionTemplates} onEdit={t => { setEditingTemplate(t); setIsTemplateFormOpen(true); }} onDelete={id => setTemplateToDelete(id)} />;
            // FIX: Use 'stock' case to match the `View` type.
            case 'stock': return <PartList parts={parts} onEdit={p => { setEditingPart(p); setIsPartFormOpen(true); }} onDelete={id => setPartToDelete(id)} onAdd={() => {setEditingPart(null); setIsPartFormOpen(true);}} onOrder={(part) => {setEditingPurchaseOrder({id: '', orderNumber: '', supplier: part.supplier, date: new Date().toISOString(), status: 'draft', items: [{id: crypto.randomUUID(), partId: part.id, quantity: 10, unitPrice: part.purchasePrice}]}); setIsPurchaseOrderFormOpen(true)}} />;
            case 'repairs': return <RepairOrderList repairOrders={repairOrders} clients={clients} technicians={technicians} onView={setRepairOrderToView} onDelete={id => setRepairOrderToDelete(id)} />;
            case 'scheduler': return <Scheduler appointments={appointments} clients={clients} onAppointmentClick={app => {
                const quote = quotes.find(q => q.id === app.quoteId);
                if (quote) setQuoteToView(quote);
            }} />;
            case 'invoices': return <InvoiceList invoices={invoices} clients={clients} onView={setInvoiceToView} onDelete={id => setInvoiceToDelete(id)} onMarkAsPaid={setInvoiceForPayment} />;
            case 'technicians': return <TechnicianList technicians={technicians} repairOrders={repairOrders} onEdit={t => { setEditingTechnician(t); setIsTechnicianFormOpen(true); }} onDelete={id => setTechnicianToDelete(id)} />;
            case 'purchases': return <PurchaseOrderList orders={purchaseOrders} onEdit={order => { setEditingPurchaseOrder(order); setIsPurchaseOrderFormOpen(true); }} onDelete={id => setPurchaseOrderToDelete(id)} onReceive={handleReceivePurchaseOrder} onMarkAsPaid={setPurchaseOrderForPayment} />;
            case 'accounting': return <AccountingDashboard invoices={invoices} purchaseOrders={purchaseOrders} quotes={quotes} />;
            case 'dashboard': return <ReportsDashboard quotes={quotes} repairOrders={repairOrders} invoices={invoices} clients={clients} />;
            case 'quotes':
            default: return <QuoteList quotes={quotes} clients={clients} appointments={appointments} onEdit={q => { setEditingQuote(q); setIsQuoteFormOpen(true); }} onDelete={id => setQuoteToDelete(id)} onView={setQuoteToView} onChangeStatus={id => setQuoteForStatusChange(quotes.find(q => q.id === id) || null)} onSchedule={q => { setQuoteToSchedule(q); setIsAppointmentFormOpen(true); }} onCreateRepairOrder={(quoteId) => {
                const quote = quotes.find(q => q.id === quoteId);
                if (!quote) return;
                const newRepairOrder: RepairOrder = { id: crypto.randomUUID(), quote: { ...quote }, status: 'scheduled' };
                setRepairOrders(prev => [...prev, newRepairOrder]);
                setQuotes(prev => prev.map(q => q.id === quoteId ? {...q, isConvertedToRepairOrder: true} : q));
                setView('repairs');
                setRepairOrderToView(newRepairOrder);
            }}/>;
        }
    };
    
    const viewConfig: {[key in View]?: {title: string, action?: () => void, actionLabel?: string}} = {
        dashboard: { title: "Tableau de bord" },
        quotes: { title: "Devis", action: () => { setEditingQuote(null); setIsQuoteFormOpen(true); }, actionLabel: "Nouveau devis" },
        clients: { title: "Clients", action: () => { setEditingClient(null); setIsClientFormOpen(true); }, actionLabel: "Ajouter un client" },
        repairs: { title: "Fiches de réparation" },
        invoices: { title: "Factures" },
        scheduler: { title: "Planning" },
        purchases: { title: "Commandes", action: () => { setEditingPurchaseOrder(null); setIsPurchaseOrderFormOpen(true); }, actionLabel: "Nouvelle commande" },
        // FIX: Use 'stock' key to match the `View` type.
        stock: { title: "Stock" },
        templates: { title: "Catalogue", action: () => { setEditingTemplate(null); setIsTemplateFormOpen(true); }, actionLabel: "Nouvelle intervention" },
        technicians: { title: "Techniciens", action: () => { setEditingTechnician(null); setIsTechnicianFormOpen(true); }, actionLabel: "Ajouter un technicien" },
        accounting: { title: "Comptabilité" },
    };
    

    return (
        <div className="bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 min-h-screen font-sans">
            <div className="flex">
                <nav className="w-64 bg-white dark:bg-gray-800 p-4 shadow-lg flex flex-col h-screen sticky top-0">
                    <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-8">GaragePro</h1>
                    <ul className="space-y-1 flex-grow overflow-y-auto">
                        {navConfig.main.map(item => (
                             <li key={item.id}>
                                <button onClick={() => setView(item.view)} className={`w-full flex items-center gap-3 p-2 rounded-md text-left font-semibold transition-colors ${view === item.view ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                                    <item.icon className="h-5 w-5"/>
                                    {item.title}
                                </button>
                            </li>
                        ))}
                        {navConfig.groups.map(group => (
                            <li key={group.id}>
                                <button onClick={() => setOpenNavs(prev => prev.includes(group.id) ? prev.filter(id => id !== group.id) : [...prev, group.id])} className="w-full flex justify-between items-center gap-3 p-2 rounded-md text-left font-semibold hover:bg-gray-100 dark:hover:bg-gray-700">
                                    <div className="flex items-center gap-3">
                                        <group.icon className="h-5 w-5"/>
                                        {group.title}
                                    </div>
                                    <ChevronDownIcon className={`h-5 w-5 transition-transform ${openNavs.includes(group.id) ? 'rotate-180' : ''}`}/>
                                </button>
                                {openNavs.includes(group.id) && (
                                    <ul className="pl-6 pt-1 space-y-1">
                                        {group.items.map(item => (
                                             <li key={item.id}>
                                                <button onClick={() => setView(item.view)} className={`w-full flex items-center gap-3 p-2 rounded-md text-left text-sm font-semibold transition-colors ${view === item.view ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                                                    <item.icon className="h-5 w-5"/>
                                                    {item.title}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        ))}
                    </ul>
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                        <button onClick={toggleTheme} className="w-full flex items-center gap-3 p-2 rounded-md text-left font-semibold hover:bg-gray-100 dark:hover:bg-gray-700">
                            {theme === 'light' ? <MoonIcon className="h-5 w-5"/> : <SunIcon className="h-5 w-5"/>}
                            {theme === 'light' ? 'Mode Sombre' : 'Mode Clair'}
                        </button>
                    </div>
                </nav>

                <main className="flex-1 p-8">
                    <header className="flex justify-between items-center mb-6">
                        <h2 className="text-3xl font-bold">{viewConfig[view]?.title}</h2>
                        {viewConfig[view]?.action && (
                            <button onClick={viewConfig[view]?.action} className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow hover:bg-blue-700 transition-colors flex items-center gap-2">
                                <PlusIcon className="h-5 w-5"/>
                                {viewConfig[view]?.actionLabel}
                            </button>
                        )}
                    </header>
                    {renderView()}
                </main>
            </div>

            {/* Modals */}
            <ClientForm isOpen={isClientFormOpen} onClose={() => setIsClientFormOpen(false)} onSave={handleSaveClient} existingClient={editingClient}/>
            <ConfirmationModal isOpen={!!clientToDelete} onClose={() => setClientToDelete(null)} onConfirm={() => { setClients(prev => prev.filter(c => c.id !== clientToDelete)); setClientToDelete(null); }} title="Confirmer la suppression">
                <p>Êtes-vous sûr de vouloir supprimer ce client et tous ses véhicules ? Cette action est irréversible.</p>
            </ConfirmationModal>

            <QuoteForm isOpen={isQuoteFormOpen} onClose={() => setIsQuoteFormOpen(false)} onSave={handleSaveQuote} clients={clients} interventionTemplates={interventionTemplates} parts={parts} existingQuote={editingQuote} nextQuoteNumber={nextQuoteNumber}/>
            <ConfirmationModal isOpen={!!quoteToDelete} onClose={() => setQuoteToDelete(null)} onConfirm={() => { setQuotes(prev => prev.filter(q => q.id !== quoteToDelete)); setQuoteToDelete(null); }} title="Confirmer la suppression">
                <p>Êtes-vous sûr de vouloir supprimer ce devis ?</p>
            </ConfirmationModal>
            <Modal isOpen={!!quoteToView} onClose={() => setQuoteToView(null)} title={`Détails du Devis ${quoteToView?.quoteNumber}`}>
                <QuoteView quote={quoteToView} client={clients.find(c => c.id === quoteToView?.clientId) || null} vehicle={clients.find(c => c.id === quoteToView?.clientId)?.vehicles.find(v => v.id === quoteToView?.vehicleId) || null} appointment={appointments.find(a => a.quoteId === quoteToView?.id)} repairOrder={repairOrders.find(ro => ro.quote.id === quoteToView?.id)} onViewRepairOrder={(order) => { setQuoteToView(null); setRepairOrderToView(order); }} onViewInScheduler={() => { setQuoteToView(null); setView('scheduler'); }}/>
            </Modal>
            <StatusChangeModal isOpen={!!quoteForStatusChange} onClose={() => setQuoteForStatusChange(null)} currentStatus={quoteForStatusChange?.status || 'draft'} quoteNumber={quoteForStatusChange?.quoteNumber || ''} onConfirm={(newStatus) => {
                if(!quoteForStatusChange) return;
                setQuotes(prev => prev.map(q => q.id === quoteForStatusChange.id ? {...q, status: newStatus, statusHistory: [...q.statusHistory, {status: newStatus, date: new Date().toISOString()}]} : q));
                setQuoteForStatusChange(null);
            }}/>
            
            <AppointmentForm isOpen={isAppointmentFormOpen} onClose={() => setIsAppointmentFormOpen(false)} onSave={handleSaveAppointment} quoteToSchedule={quoteToSchedule} clients={clients} />

            <InterventionTemplateForm isOpen={isTemplateFormOpen} onClose={() => setIsTemplateFormOpen(false)} onSave={handleSaveTemplate} parts={parts} existingTemplate={editingTemplate} />
            <ConfirmationModal isOpen={!!templateToDelete} onClose={() => setTemplateToDelete(null)} onConfirm={() => { setInterventionTemplates(prev => prev.filter(t => t.id !== templateToDelete)); setTemplateToDelete(null); }} title="Confirmer la suppression">
                <p>Êtes-vous sûr de vouloir supprimer ce modèle d'intervention ?</p>
            </ConfirmationModal>

            <PartForm isOpen={isPartFormOpen} onClose={() => setIsPartFormOpen(false)} onSave={handleSavePart} existingPart={editingPart}/>
            <ConfirmationModal isOpen={!!partToDelete} onClose={() => setPartToDelete(null)} onConfirm={() => { setParts(prev => prev.filter(p => p.id !== partToDelete)); setPartToDelete(null); }} title="Confirmer la suppression">
                <p>Êtes-vous sûr de vouloir supprimer cette pièce ?</p>
            </ConfirmationModal>

            <Modal isOpen={!!repairOrderToView} onClose={() => setRepairOrderToView(null)} title={`Fiche de réparation ${repairOrderToView?.quote.quoteNumber.replace('DEV', 'FICHE')}`}>
                <RepairOrderView order={repairOrderToView} client={clients.find(c => c.id === repairOrderToView?.quote.clientId) || null} vehicle={clients.find(c => c.id === repairOrderToView?.quote.clientId)?.vehicles.find(v => v.id === repairOrderToView?.quote.vehicleId) || null} invoice={invoices.find(inv => inv.quote.id === repairOrderToView?.quote.id)} technicians={technicians} 
                onUpdateStatus={handleUpdateRepairStatus}
                onAddInspection={id => {setRepairOrderToView(null); setInspectionForRepairOrder(id);}}
                onGenerateInvoice={id => {
                    const order = repairOrders.find(ro => ro.id === id);
                    if(!order) return;
                    const invoiceNumber = `FAC-${new Date().getFullYear()}-${(invoices.length + 1).toString().padStart(4, '0')}`;
                    const newInvoice: Invoice = {
                        id: crypto.randomUUID(),
                        invoiceNumber,
                        quote: order.quote,
                        date: new Date().toISOString(),
                        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                        status: 'draft',
                    };
                    setInvoices(prev => [...prev, newInvoice]);
                    handleUpdateRepairStatus(id, 'invoiced');
                    setRepairOrderToView(null);
                    setInvoiceToView(newInvoice);
                }}
                onViewInvoice={(inv) => { setRepairOrderToView(null); setInvoiceToView(inv); }}
                onAssignTechnician={(orderId, techId) => setRepairOrders(prev => prev.map(ro => ro.id === orderId ? {...ro, technicianId: techId || undefined} : ro))}
                onSaveNotes={(orderId, notes) => setRepairOrders(prev => prev.map(ro => ro.id === orderId ? {...ro, notes} : ro))}
                />
            </Modal>
            <ConfirmationModal isOpen={!!repairOrderToDelete} onClose={() => setRepairOrderToDelete(null)} onConfirm={() => {
                setRepairOrders(prev => prev.filter(ro => ro.id !== repairOrderToDelete));
                // Optionally revert quote status
                const order = repairOrders.find(ro => ro.id === repairOrderToDelete);
                if (order) {
                    setQuotes(prev => prev.map(q => q.id === order.quote.id ? { ...q, isConvertedToRepairOrder: false } : q));
                }
                setRepairOrderToDelete(null);
            }} title="Confirmer la suppression">
                <p>Êtes-vous sûr de vouloir supprimer cette fiche de réparation ? Le devis associé sera de nouveau modifiable.</p>
            </ConfirmationModal>
            
            <VehicleInspectionForm isOpen={!!inspectionForRepairOrder} onClose={() => setInspectionForRepairOrder(null)} repairOrderNumber={repairOrders.find(ro => ro.id === inspectionForRepairOrder)?.quote.quoteNumber.replace('DEV', 'FICHE') || ''} onSave={(report: VehicleInspectionReport) => {
                setRepairOrders(prev => prev.map(ro => ro.id === inspectionForRepairOrder ? {...ro, inspectionReport: report, status: 'diagnosis_complete'} : ro));
                setInspectionForRepairOrder(null);
            }}/>

            <Modal isOpen={!!invoiceToView} onClose={() => setInvoiceToView(null)} title={`Facture ${invoiceToView?.invoiceNumber}`}>
                <InvoiceView invoice={invoiceToView} client={clients.find(c => c.id === invoiceToView?.quote.clientId) || null} vehicle={clients.find(c => c.id === invoiceToView?.quote.clientId)?.vehicles.find(v => v.id === invoiceToView?.quote.vehicleId) || null} onMarkAsPaid={setInvoiceForPayment} />
            </Modal>
            <ConfirmationModal isOpen={!!invoiceToDelete} onClose={() => setInvoiceToDelete(null)} onConfirm={() => { setInvoices(prev => prev.filter(i => i.id !== invoiceToDelete)); setInvoiceToDelete(null); }} title="Confirmer la suppression">
                <p>Êtes-vous sûr de vouloir supprimer cette facture ?</p>
            </ConfirmationModal>
            <PaymentForm isOpen={!!invoiceForPayment} onClose={() => setInvoiceForPayment(null)} invoice={invoiceForPayment} onSave={(details: PaymentDetails) => {
                if(!invoiceForPayment) return;
                const updatedInvoice = {...invoiceForPayment, status: 'paid' as const, paymentDetails: details};
                setInvoices(prev => prev.map(inv => inv.id === invoiceForPayment.id ? updatedInvoice : inv));

                const total = updatedInvoice.quote.laborItems.reduce((sum, item) => sum + (item.hours * item.rate) + item.partItems.reduce((pSum, p) => pSum + (p.quantity * p.unitPrice), 0), 0) * (1 + updatedInvoice.quote.taxRate / 100);
                const newTransaction: FinancialTransaction = {
                    id: crypto.randomUUID(),
                    date: details.date,
                    type: 'revenue',
                    amount: total,
                    description: `Paiement facture ${updatedInvoice.invoiceNumber}`,
                    referenceId: updatedInvoice.id,
                };
                setTransactions(prev => [...prev, newTransaction]);
                setInvoiceForPayment(null);
            }} />

            <TechnicianForm isOpen={isTechnicianFormOpen} onClose={() => setIsTechnicianFormOpen(false)} onSave={handleSaveTechnician} existingTechnician={editingTechnician} />
            <ConfirmationModal isOpen={!!technicianToDelete} onClose={() => setTechnicianToDelete(null)} onConfirm={() => { setTechnicians(prev => prev.filter(t => t.id !== technicianToDelete)); setTechnicianToDelete(null); }} title="Confirmer la suppression">
                <p>Êtes-vous sûr de vouloir supprimer ce technicien ?</p>
            </ConfirmationModal>

            <PurchaseOrderForm isOpen={isPurchaseOrderFormOpen} onClose={() => setIsPurchaseOrderFormOpen(false)} onSave={handleSavePurchaseOrder} parts={parts} existingOrder={editingPurchaseOrder} nextOrderNumber={nextPurchaseOrderNumber}/>
             <ConfirmationModal isOpen={!!purchaseOrderToDelete} onClose={() => setPurchaseOrderToDelete(null)} onConfirm={() => { setPurchaseOrders(prev => prev.filter(po => po.id !== purchaseOrderToDelete)); setPurchaseOrderToDelete(null); }} title="Confirmer la suppression">
                <p>Êtes-vous sûr de vouloir supprimer cette commande fournisseur ?</p>
            </ConfirmationModal>
            <PurchaseOrderPaymentForm isOpen={!!purchaseOrderForPayment} onClose={() => setPurchaseOrderForPayment(null)} onSave={handleSavePurchaseOrderPayment} order={purchaseOrderForPayment} />

        </div>
    );
};

export default App;