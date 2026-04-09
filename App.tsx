import React, { useState, useMemo, useEffect } from 'react';
import useLocalStorage from './hooks/useLocalStorage';
import { 
    Client, Quote, Appointment, RepairOrder, Invoice, Part, Technician, InterventionTemplate, 
    VehicleServiceHistory, PurchaseOrder, FinancialTransaction, Settings, RepairOrderStatus, QuoteStatus, VehicleInspectionReport, PaymentDetails, PurchaseOrderItem
} from './types';

// Import seed data
import { 
    seedClients, seedQuotes, seedAppointments, seedRepairOrders, seedInvoices, seedParts, 
    seedTechnicians, seedInterventionTemplates, seedPurchaseOrders, seedFinancialTransactions 
} from './services/seedData';

// Import components
import QuoteList from './components/QuoteList';
import QuoteForm from './components/QuoteForm';
import ClientList from './components/ClientList';
import ClientForm from './components/ClientForm';
import Modal from './components/Modal';
import QuoteView from './components/QuoteView';
import ConfirmationModal from './components/ConfirmationModal';
import StatusChangeModal from './components/StatusChangeModal';
import AppointmentForm from './components/AppointmentForm';
import Scheduler from './components/Scheduler';
import RepairOrderList from './components/RepairOrderList';
import RepairOrderView from './components/RepairOrderView';
import VehicleInspectionForm from './components/VehicleInspectionForm';
import InvoiceList from './components/InvoiceList';
import InvoiceView from './components/InvoiceView';
import PaymentForm from './components/PaymentForm';
import InterventionTemplateList from './components/InterventionTemplateList';
import InterventionTemplateForm from './components/InterventionTemplateForm';
import TechnicianList from './components/TechnicianList';
import TechnicianForm from './components/TechnicianForm';
import PartList from './components/PartList';
import PartForm from './components/PartForm';
import PartPricing from './components/PartPricing';
import PreOrderList from './components/PreOrderList';
import PurchaseOrderList from './components/PurchaseOrderList';
import PurchaseOrderForm from './components/PurchaseOrderForm';
import PurchaseOrderPaymentForm from './components/PurchaseOrderPaymentForm';
import ReportsDashboard from './components/ReportsDashboard';
import AccountingDashboard from './components/AccountingDashboard';
import SettingsComponent from './components/Settings';

// Import icons for sidebar
import { 
    FileTextIcon, UsersIcon, CalendarIcon, WrenchIcon, ReceiptTaxIcon, BookOpenIcon, 
    BoxIcon, ShoppingCartIcon, ChartBarIcon, CogIcon, SunIcon, MoonIcon, ChevronDownIcon, WalletIcon, DocumentSearchIcon
} from './components/icons';


type View = 'quotes' | 'clients' | 'scheduler' | 'repair_orders' | 'invoices' | 'templates' | 'technicians' | 'parts' | 'part_pricing' | 'pre_orders' | 'purchase_orders' | 'reports' | 'accounting' | 'settings';

const App: React.FC = () => {
    // Main state management using useLocalStorage hook
    const [clients, setClients] = useLocalStorage<Client[]>('clients', seedClients);
    const [quotes, setQuotes] = useLocalStorage<Quote[]>('quotes', seedQuotes);
    const [appointments, setAppointments] = useLocalStorage<Appointment[]>('appointments', seedAppointments);
    const [repairOrders, setRepairOrders] = useLocalStorage<RepairOrder[]>('repairOrders', seedRepairOrders);
    const [invoices, setInvoices] = useLocalStorage<Invoice[]>('invoices', seedInvoices);
    const [parts, setParts] = useLocalStorage<Part[]>('parts', seedParts);
    const [technicians, setTechnicians] = useLocalStorage<Technician[]>('technicians', seedTechnicians);
    const [interventionTemplates, setInterventionTemplates] = useLocalStorage<InterventionTemplate[]>('interventionTemplates', seedInterventionTemplates);
    const [purchaseOrders, setPurchaseOrders] = useLocalStorage<PurchaseOrder[]>('purchaseOrders', seedPurchaseOrders);
    const [transactions, setTransactions] = useLocalStorage<FinancialTransaction[]>('financialTransactions', seedFinancialTransactions);
    const [settings, setSettings] = useLocalStorage<Settings>('settings', { garageName: 'FixUp', address: '1 Rue de la République', postalCode: '75001', city: 'Paris', phone: '0123456789', email: 'contact@fixup.com', logo: '' });
    const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('theme', 'light');

    // UI State
    const [activeView, setActiveView] = useState<View>('reports');
    
    // Modal states
    const [isQuoteFormOpen, setIsQuoteFormOpen] = useState(false);
    const [quoteToEdit, setQuoteToEdit] = useState<Quote | null>(null);
    const [isClientFormOpen, setIsClientFormOpen] = useState(false);
    const [clientToEdit, setClientToEdit] = useState<Client | null>(null);
    const [quoteToView, setQuoteToView] = useState<Quote | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<{ id: string; type: string; name: string } | null>(null);
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [quoteForStatusChange, setQuoteForStatusChange] = useState<Quote | null>(null);
    const [isAppointmentFormOpen, setIsAppointmentFormOpen] = useState(false);
    const [quoteToSchedule, setQuoteToSchedule] = useState<Quote | null>(null);
    const [orderToView, setOrderToView] = useState<RepairOrder | null>(null);
    const [isInspectionFormOpen, setIsInspectionFormOpen] = useState(false);
    const [orderForInspection, setOrderForInspection] = useState<RepairOrder | null>(null);
    const [invoiceToView, setInvoiceToView] = useState<Invoice | null>(null);
    const [isPaymentFormOpen, setIsPaymentFormOpen] = useState(false);
    const [invoiceForPayment, setInvoiceForPayment] = useState<Invoice | null>(null);
    const [isTemplateFormOpen, setIsTemplateFormOpen] = useState(false);
    const [templateToEdit, setTemplateToEdit] = useState<InterventionTemplate | null>(null);
    const [isTechnicianFormOpen, setIsTechnicianFormOpen] = useState(false);
    const [technicianToEdit, setTechnicianToEdit] = useState<Technician | null>(null);
    const [isPartFormOpen, setIsPartFormOpen] = useState(false);
    const [partToEdit, setPartToEdit] = useState<Part | null>(null);
    const [isPOFormOpen, setIsPOFormOpen] = useState(false);
    const [poToEdit, setPOToEdit] = useState<PurchaseOrder | null>(null);
    const [isPOPaymentFormOpen, setIsPOPaymentFormOpen] = useState(false);
    const [poForPayment, setPOForPayment] = useState<PurchaseOrder | null>(null);
    const [openSection, setOpenSection] = useState('Atelier');


    // Computed values
    const nextQuoteNumber = useMemo(() => {
        const lastNumber = quotes.reduce((max, q) => {
            const num = parseInt(q.quoteNumber.split('-')[1], 10);
            return num > max ? num : max;
        }, 0);
        return `DEV-${(lastNumber + 1).toString().padStart(5, '0')}`;
    }, [quotes]);
    const nextInvoiceNumber = useMemo(() => {
        const lastNumber = invoices.reduce((max, i) => {
            const num = parseInt(i.invoiceNumber.split('-')[2], 10);
            return num > max ? num : max;
        }, 0);
        return `FAC-${new Date().getFullYear()}-${(lastNumber + 1).toString().padStart(4, '0')}`;
    }, [invoices]);
     const nextPurchaseOrderNumber = useMemo(() => {
        const lastNumber = purchaseOrders.reduce((max, po) => {
            const num = parseInt(po.orderNumber.split('-')[1], 10);
            return num > max ? num : max;
        }, 0);
        return `CMD-${(lastNumber + 1).toString().padStart(5, '0')}`;
    }, [purchaseOrders]);

    const technicianWorkload = useMemo(() => {
        const workloadMap = new Map<string, number>();
        technicians.forEach(tech => workloadMap.set(tech.id, 0));
    
        const activeStatuses: RepairOrderStatus[] = [
            'scheduled', 
            'workshop_entry', 
            'diagnosis_complete', 
            'in_progress', 
            'waiting_for_part'
        ];
    
        repairOrders.forEach(order => {
            if (order.technicianId && activeStatuses.includes(order.status)) {
                workloadMap.set(order.technicianId, (workloadMap.get(order.technicianId) || 0) + 1);
            }
        });
        return workloadMap;
    }, [repairOrders, technicians]);


    // Theme toggler
    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
    };

    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
    }, [theme]);


    // Handlers
    const handleSaveQuote = (quote: Quote) => {
        setQuotes(prev => {
            const index = prev.findIndex(q => q.id === quote.id);
            if (index > -1) {
                const newQuotes = [...prev];
                newQuotes[index] = quote;
                return newQuotes;
            }
            return [...prev, quote];
        });
        setIsQuoteFormOpen(false);
        setQuoteToEdit(null);
    };

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
        setClientToEdit(null);
    };

    const handleConfirmDelete = () => {
        if (!itemToDelete) return;

        switch (itemToDelete.type) {
            case 'quote':
                setQuotes(prev => prev.filter(q => q.id !== itemToDelete.id));
                break;
            case 'client':
                setClients(prev => prev.filter(c => c.id !== itemToDelete.id));
                break;
            case 'template':
                setInterventionTemplates(prev => prev.filter(t => t.id !== itemToDelete.id));
                break;
            case 'technician':
                setTechnicians(prev => prev.filter(t => t.id !== itemToDelete.id));
                break;
            case 'part':
                setParts(prev => prev.filter(p => p.id !== itemToDelete.id));
                break;
            case 'repair_order':
                setRepairOrders(prev => prev.filter(ro => ro.id !== itemToDelete.id));
                break;
            case 'invoice':
                setInvoices(prev => prev.filter(inv => inv.id !== itemToDelete.id));
                break;
            case 'purchase_order':
                setPurchaseOrders(prev => prev.filter(po => po.id !== itemToDelete.id));
                break;
        }

        setIsDeleteModalOpen(false);
        setItemToDelete(null);
    };

    const createDeleteHandler = (type: string, nameAccessor: (item: any) => string) => (id: string) => {
        let item;
        switch(type) {
            case 'quote': item = quotes.find(i => i.id === id); break;
            case 'client': item = clients.find(i => i.id === id); break;
            case 'template': item = interventionTemplates.find(i => i.id === id); break;
            case 'technician': item = technicians.find(i => i.id === id); break;
            case 'part': item = parts.find(i => i.id === id); break;
            case 'repair_order': item = repairOrders.find(i => i.id === id); break;
            case 'invoice': item = invoices.find(i => i.id === id); break;
            case 'purchase_order': item = purchaseOrders.find(i => i.id === id); break;
        }
        if (item) {
            setItemToDelete({ id, type, name: nameAccessor(item) });
            setIsDeleteModalOpen(true);
        }
    };

    const handleDeleteQuote = createDeleteHandler('quote', (q: Quote) => q.quoteNumber);
    const handleDeleteClient = createDeleteHandler('client', (c: Client) => c.name);
    const handleDeleteTemplate = createDeleteHandler('template', (t: InterventionTemplate) => t.name);
    const handleDeleteTechnician = createDeleteHandler('technician', (t: Technician) => t.name);
    const handleDeletePart = (partId: string) => {
        setParts(prev => prev.filter(p => p.id !== partId));
    };
    const handleDeleteRepairOrder = createDeleteHandler('repair_order', (ro: RepairOrder) => ro.quote.quoteNumber.replace('DEV', 'FICHE'));
    const handleDeleteInvoice = createDeleteHandler('invoice', (inv: Invoice) => inv.invoiceNumber);
    const handleDeletePurchaseOrder = createDeleteHandler('purchase_order', (po: PurchaseOrder) => po.orderNumber);


    const handleStatusChange = (status: QuoteStatus) => {
        if (!quoteForStatusChange) return;
        setQuotes(prev => prev.map(q => q.id === quoteForStatusChange.id ? { ...q, status, statusHistory: [...q.statusHistory, { status, date: new Date().toISOString() }] } : q));
        setIsStatusModalOpen(false);
        setQuoteForStatusChange(null);
    };
    
    const handleSaveAppointment = (appointment: Omit<Appointment, 'id'>) => {
        const newAppointment = { ...appointment, id: crypto.randomUUID() };
        setAppointments(prev => [...prev, newAppointment]);
        setIsAppointmentFormOpen(false);
        setQuoteToSchedule(null);
    };
    
    const handleCreateRepairOrder = (quoteId: string) => {
        const quote = quotes.find(q => q.id === quoteId);
        if(!quote) return;
        const newRepairOrder: RepairOrder = {
            id: crypto.randomUUID(),
            quote,
            status: 'scheduled',
        };
        setRepairOrders(prev => [...prev, newRepairOrder]);
        setQuotes(prev => prev.map(q => q.id === quoteId ? {...q, isConvertedToRepairOrder: true} : q));
    };

    const handleUpdateRepairOrderStatus = (orderId: string, status: RepairOrderStatus) => {
        // Mettre à jour la liste principale des fiches de réparation
        setRepairOrders(prevOrders =>
            prevOrders.map(ro =>
                ro.id === orderId ? { ...ro, status } : ro
            )
        );

        // Si la fiche en cours de visualisation est celle que nous mettons à jour,
        // mettez également à jour son état pour un rafraîchissement immédiat de la vue.
        if (orderToView?.id === orderId) {
            setOrderToView(prevOrder => {
                if (!prevOrder) return null;
                return { ...prevOrder, status };
            });
        }
    };

    const handleSaveInspection = (report: VehicleInspectionReport) => {
        if (!orderForInspection) return;
        
        const updatedData = { inspectionReport: report, status: 'diagnosis_complete' as const };

        setRepairOrders(prev => prev.map(ro => ro.id === orderForInspection.id ? {...ro, ...updatedData } : ro));
        
        if (orderToView?.id === orderForInspection.id) {
            setOrderToView(prevOrder => {
                if (!prevOrder) return null;
                return { ...prevOrder, ...updatedData };
            });
        }
        
        setIsInspectionFormOpen(false);
        setOrderForInspection(null);
    };
    
    const handleGenerateInvoice = (orderId: string) => {
        const order = repairOrders.find(ro => ro.id === orderId);
        if(!order) return;
        
        const client = clients.find(c => c.id === order.quote.clientId);
        if (client) {
            const vehicle = client.vehicles.find(v => v.id === order.quote.vehicleId);
            if(vehicle && order.mileage) {
                const serviceHistoryEntry: VehicleServiceHistory = {
                    id: crypto.randomUUID(),
                    date: new Date().toISOString(),
                    mileage: order.mileage,
                    description: order.quote.laborItems.map(l => l.description).join('; '),
                    referenceId: order.id,
                };
                const updatedClient = {
                    ...client,
                    vehicles: client.vehicles.map(v => v.id === vehicle.id ? {...v, serviceHistory: [...v.serviceHistory, serviceHistoryEntry]} : v)
                };
                setClients(prev => prev.map(c => c.id === client.id ? updatedClient : c));
            }
        }
        
        const newInvoice: Invoice = {
            id: crypto.randomUUID(),
            invoiceNumber: nextInvoiceNumber,
            quote: order.quote,
            date: new Date().toISOString(),
            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'draft',
        };

        setInvoices(prev => [...prev, newInvoice]);
        
        // Mettre à jour le statut de la fiche de réparation
        setRepairOrders(prev => prev.map(ro => ro.id === orderId ? {...ro, status: 'invoiced'} : ro));
        
        // Mettre à jour la vue si elle est ouverte
        if (orderToView?.id === orderId) {
            setOrderToView(prevOrder => {
                if (!prevOrder) return null;
                return { ...prevOrder, status: 'invoiced' };
            });
        }
    };

    const handleMarkInvoiceAsPaid = (details: PaymentDetails) => {
        if (!invoiceForPayment) return;
        const updatedInvoice = { ...invoiceForPayment, status: 'paid' as const, paymentDetails: details };
        setInvoices(prev => prev.map(inv => inv.id === invoiceForPayment.id ? updatedInvoice : inv));

        const total = updatedInvoice.quote.laborItems.reduce((acc, l) => acc + (l.hours * l.rate) + l.partItems.reduce((pAcc, p) => pAcc + (p.quantity * p.unitPrice), 0), 0) * (1 + updatedInvoice.quote.taxRate/100);
        const newTransaction: FinancialTransaction = {
            id: crypto.randomUUID(),
            date: details.date,
            type: 'revenue',
            amount: total,
            description: `Paiement facture ${updatedInvoice.invoiceNumber}`,
            referenceId: updatedInvoice.id,
        };
        setTransactions(prev => [...prev, newTransaction]);
        
        setIsPaymentFormOpen(false);
        setInvoiceForPayment(null);
        setInvoiceToView(updatedInvoice);
    };

    const handleSaveTemplate = (template: InterventionTemplate) => {
        setInterventionTemplates(prev => {
            const index = prev.findIndex(t => t.id === template.id);
            return index > -1 ? prev.map((t, i) => i === index ? template : t) : [...prev, template];
        });
        setIsTemplateFormOpen(false);
        setTemplateToEdit(null);
    };

    const handleSaveTechnician = (technician: Technician) => {
        setTechnicians(prev => {
            const index = prev.findIndex(t => t.id === technician.id);
            return index > -1 ? prev.map((t, i) => i === index ? technician : t) : [...prev, technician];
        });
        setIsTechnicianFormOpen(false);
        setTechnicianToEdit(null);
    };
    
    const handleSavePart = (part: Part) => {
        setParts(prev => {
            const index = prev.findIndex(p => p.id === part.id);
            return index > -1 ? prev.map((p, i) => i === index ? part : p) : [...prev, part];
        });
        setIsPartFormOpen(false);
        setPartToEdit(null);
    };

    const handleUpdatePartPrices = (pricedParts: Map<string, { price: number; supplier: string; supplierReference: string; }>) => {
        const DEFAULT_MARKUP = 1.5; // 50% markup as a default
    
        setQuotes(prevQuotes => {
            const newQuotes = prevQuotes.map(quote => {
                if (quote.status !== 'awaiting_part_pricing') return quote;
    
                let hasPendingParts = false;
                const updatedLaborItems = quote.laborItems.map(labor => {
                    const updatedPartItems = labor.partItems.map(part => {
                        if (part.isPreOrder && part.preOrderStatus === 'pending_pricing') {
                            const key = `${part.description}_${part.reference || ''}`;
                            if (pricedParts.has(key)) {
                                const data = pricedParts.get(key)!;
                                return {
                                    ...part,
                                    unitPrice: data.price * DEFAULT_MARKUP,
                                    purchasePrice: data.price,
                                    preOrderStatus: 'priced' as const,
                                    supplier: data.supplier,
                                    supplierReference: data.supplierReference,
                                };
                            } else {
                                hasPendingParts = true;
                                return part;
                            }
                        }
                        return part;
                    });
                    return { ...labor, partItems: updatedPartItems };
                });
    
                const newStatus: QuoteStatus = hasPendingParts ? 'awaiting_part_pricing' : 'draft';
                if(quote.status !== newStatus) {
                    quote.statusHistory.push({ status: newStatus, date: new Date().toISOString() });
                }

                return {
                    ...quote,
                    laborItems: updatedLaborItems,
                    status: newStatus,
                };
            });
            return newQuotes;
        });
    };

    const handleSavePurchaseOrder = (order: PurchaseOrder, newParts: Part[] = []) => {
        // 1. Create new parts if any
        if (newParts.length > 0) {
            setParts(prev => [...prev, ...newParts]);
        }
    
        // 2. Save purchase order
        setPurchaseOrders(prev => {
            const index = prev.findIndex(po => po.id === order.id);
            if (index > -1) {
                const newOrders = [...prev];
                newOrders[index] = order;
                return newOrders;
            }
            return [...prev, order];
        });
        
        setIsPOFormOpen(false);
        setPOToEdit(null);
    };

    const handleCreatePurchaseOrderFromPreOrder = (supplier: string, itemsToOrder: { id: string; partId: string; description: string; quantity: number; purchasePrice: number; }[]) => {
        const newPO: PurchaseOrder = {
            id: crypto.randomUUID(),
            orderNumber: nextPurchaseOrderNumber,
            supplier,
            date: new Date().toISOString(),
            status: 'draft',
            items: itemsToOrder.map(item => ({
                id: crypto.randomUUID(),
                partId: item.partId,
                description: item.description,
                quantity: item.quantity,
                unitPrice: item.purchasePrice,
            })),
        };
        setPurchaseOrders(prev => [...prev, newPO]);

        const itemIdsToUpdate = new Set(itemsToOrder.map(item => item.id));
        setQuotes(prevQuotes =>
            prevQuotes.map(quote => {
                let quoteWasModified = false;
                const updatedLaborItems = quote.laborItems.map(labor => {
                    let laborWasModified = false;
                    const updatedPartItems = labor.partItems.map(part => {
                        if (
                            part.preOrderStatus === 'priced' &&
                            part.supplier === supplier &&
                            itemIdsToUpdate.has(part.id)
                        ) {
                            laborWasModified = true;
                            quoteWasModified = true;
                            return { ...part, preOrderStatus: 'ordered' as const };
                        }
                        return part;
                    });
                    if (laborWasModified) {
                        return { ...labor, partItems: updatedPartItems };
                    }
                    return labor;
                });
                if (quoteWasModified) {
                    return { ...quote, laborItems: updatedLaborItems };
                }
                return quote;
            })
        );
        
        alert(`Bon de commande ${newPO.orderNumber} créé pour ${supplier}.`);
    };

    const handleReceivePO = (orderId: string) => {
        const order = purchaseOrders.find(po => po.id === orderId);
        if(!order) return;
        setPurchaseOrders(prev => prev.map(po => po.id === orderId ? {...po, status: 'received'} : po));
        setParts(prevParts => {
            const newParts = [...prevParts];
            order.items.forEach(item => {
                const partIndex = newParts.findIndex(p => p.id === item.partId);
                if(partIndex > -1) {
                    newParts[partIndex].stock += item.quantity;
                }
            });
            return newParts;
        });
    };

    const handleMarkPOAsPaid = (paymentDetails: {date: string}) => {
        if (!poForPayment) return;
        const updatedPO = { ...poForPayment, isPaid: true, paymentDate: paymentDetails.date };
        setPurchaseOrders(prev => prev.map(po => po.id === poForPayment.id ? updatedPO : po));
        
        const total = updatedPO.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
        const newTransaction: FinancialTransaction = {
            id: crypto.randomUUID(),
            date: paymentDetails.date,
            type: 'expense',
            amount: -total,
            description: `Paiement commande ${updatedPO.orderNumber} (${updatedPO.supplier})`,
            referenceId: updatedPO.id,
        };
        setTransactions(prev => [...prev, newTransaction]);
        
        setIsPOPaymentFormOpen(false);
        setPOForPayment(null);
    };
    
    const handleAssignTechnician = (orderId: string, technicianId: string) => {
        setRepairOrders(prev => prev.map(ro => ro.id === orderId ? {...ro, technicianId} : ro));
    };

    const handleSaveRepairOrderNotes = (orderId: string, notes: string) => {
        setRepairOrders(prev => prev.map(ro => ro.id === orderId ? {...ro, notes} : ro));
    };
    
    const handleSaveRepairOrderMileage = (orderId: string, mileage: number) => {
        setRepairOrders(prev => prev.map(ro => ro.id === orderId ? {...ro, mileage} : ro));
    };

    const handleViewInvoiceFromRepairOrder = (repairOrderId: string) => {
        const repairOrder = repairOrders.find(ro => ro.id === repairOrderId);
        if (!repairOrder) {
            console.error(`Repair order with id ${repairOrderId} not found.`);
            return;
        }
        const relatedInvoice = invoices.find(inv => inv.quote.id === repairOrder.quote.id);
        if (relatedInvoice) {
            setInvoiceToView(relatedInvoice);
        } else {
            alert("Aucune facture n'a été trouvée pour cette intervention.");
        }
    };
    

    const renderView = () => {
        switch (activeView) {
            case 'quotes':
                return <QuoteList
                    quotes={quotes}
                    clients={clients}
                    appointments={appointments}
                    onEdit={quote => { setQuoteToEdit(quote); setIsQuoteFormOpen(true); }}
                    onDelete={handleDeleteQuote}
                    onView={quote => setQuoteToView(quote)}
                    onChangeStatus={quoteId => { setQuoteForStatusChange(quotes.find(q => q.id === quoteId) || null); setIsStatusModalOpen(true); }}
                    onSchedule={quote => { setQuoteToSchedule(quote); setIsAppointmentFormOpen(true); }}
                    onCreateRepairOrder={handleCreateRepairOrder}
                />;
            case 'clients':
                return <ClientList 
                    clients={clients} 
                    onEdit={client => { setClientToEdit(client); setIsClientFormOpen(true); }} 
                    onDelete={handleDeleteClient}
                />;
            case 'scheduler':
                return <Scheduler 
                    appointments={appointments} 
                    clients={clients} 
                    onAppointmentClick={app => setQuoteToView(quotes.find(q => q.id === app.quoteId) || null)}
                />;
            case 'repair_orders':
                return <RepairOrderList 
                    repairOrders={repairOrders} 
                    clients={clients} 
                    technicians={technicians}
                    onView={order => setOrderToView(order)} 
                    onDelete={handleDeleteRepairOrder}
                    onAssignTechnician={handleAssignTechnician}
                    technicianWorkload={technicianWorkload}
                />;
            case 'invoices':
                return <InvoiceList
                    invoices={invoices}
                    clients={clients}
                    onView={invoice => setInvoiceToView(invoice)}
                    onDelete={handleDeleteInvoice}
                    onMarkAsPaid={invoice => { setInvoiceForPayment(invoice); setIsPaymentFormOpen(true); }}
                />;
            case 'templates':
                return <InterventionTemplateList 
                    templates={interventionTemplates}
                    onEdit={template => { setTemplateToEdit(template); setIsTemplateFormOpen(true); }}
                    onDelete={handleDeleteTemplate}
                />;
            case 'technicians':
                return <TechnicianList 
                    technicians={technicians} 
                    repairOrders={repairOrders}
                    onEdit={tech => { setTechnicianToEdit(tech); setIsTechnicianFormOpen(true); }}
                    onDelete={handleDeleteTechnician}
                />;
            case 'parts':
                return <PartList 
                    parts={parts}
                    onAdd={() => setIsPartFormOpen(true)}
                    onEdit={part => { setPartToEdit(part); setIsPartFormOpen(true); }}
                    onDelete={handleDeletePart}
                    onOrder={part => { 
                        setPOToEdit({
                            id: crypto.randomUUID(), 
                            orderNumber: nextPurchaseOrderNumber, 
                            supplier: part.supplier, 
                            date: new Date().toISOString(), 
                            status: 'draft', 
                            items: [{ id: crypto.randomUUID(), partId: part.id, description: part.name, quantity: 10, unitPrice: part.purchasePrice }]
                        });
                        setIsPOFormOpen(true);
                    }}
                />;
            case 'part_pricing':
                return <PartPricing
                    quotes={quotes}
                    onUpdatePrices={handleUpdatePartPrices}
                />;
            case 'pre_orders':
                return <PreOrderList 
                    quotes={quotes}
                    onCreatePurchaseOrder={handleCreatePurchaseOrderFromPreOrder}
                />;
            case 'purchase_orders':
                return <PurchaseOrderList
                    orders={purchaseOrders}
                    onEdit={order => { setPOToEdit(order); setIsPOFormOpen(true); }}
                    onDelete={handleDeletePurchaseOrder}
                    onReceive={handleReceivePO}
                    onMarkAsPaid={order => { setPOForPayment(order); setIsPOPaymentFormOpen(true); }}
                />;
            case 'reports':
                return <ReportsDashboard 
                    quotes={quotes}
                    repairOrders={repairOrders}
                    invoices={invoices}
                    clients={clients}
                    purchaseOrders={purchaseOrders}
                    technicians={technicians}
                />;
            case 'accounting':
                return <AccountingDashboard invoices={invoices} purchaseOrders={purchaseOrders} />;
            case 'settings':
                return <SettingsComponent settings={settings} onSave={setSettings} />;
            default:
                return <div>Selectionnez une vue</div>;
        }
    };
    
    const sidebarGroups = [
        { 
            title: 'Atelier', 
            icon: WrenchIcon,
            items: [
                { view: 'repair_orders', label: 'Fiches Réparation', icon: WrenchIcon },
                { view: 'scheduler', label: 'Planning', icon: CalendarIcon },
                { view: 'parts', label: 'Pièces', icon: BoxIcon },
                { view: 'templates', label: 'Catalogue', icon: BookOpenIcon },
            ]
        },
        {
            title: 'Gestion',
            icon: BookOpenIcon,
            items: [
                { view: 'quotes', label: 'Devis', icon: FileTextIcon },
                { view: 'invoices', label: 'Factures', icon: ReceiptTaxIcon },
                { view: 'purchase_orders', label: 'Commandes', icon: ShoppingCartIcon },
                { view: 'part_pricing', label: 'Cotations Pièces', icon: DocumentSearchIcon },
                { view: 'pre_orders', label: 'Pré-commandes', icon: ShoppingCartIcon },
                { view: 'clients', label: 'Clients', icon: UsersIcon },
                { view: 'technicians', label: 'Techniciens', icon: UsersIcon },
            ]
        },
        {
            title: 'Analyse',
            icon: ChartBarIcon,
            items: [
                { view: 'reports', label: 'Tableau de bord', icon: ChartBarIcon },
                { view: 'accounting', label: 'Analyse Financière', icon: WalletIcon },
            ]
        }
    ];

    const currentClient = quoteToView ? clients.find(c => c.id === quoteToView.clientId) : null;
    const currentVehicle = currentClient && quoteToView ? currentClient.vehicles.find(v => v.id === quoteToView.vehicleId) : null;

    // Find the active section to keep it open
    useEffect(() => {
        const activeGroup = sidebarGroups.find(group => group.items.some(item => item.view === activeView));
        if (activeGroup) {
            setOpenSection(activeGroup.title);
        }
    }, [activeView]);

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
            <aside className="w-64 bg-white dark:bg-gray-800 p-4 flex flex-col shadow-lg overflow-y-auto">
                <div className="flex items-center justify-center h-16 mb-4">
                    {settings.logo ? (
                        <img src={settings.logo} alt="Logo" className="h-12 w-auto object-contain"/>
                    ) : (
                         <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400 text-center">{settings.garageName}</h1>
                    )}
                </div>

                <nav className="flex-grow space-y-2">
                    {sidebarGroups.map(group => (
                        <div key={group.title}>
                             <button onClick={() => setOpenSection(openSection === group.title ? '' : group.title)} className="w-full text-left flex items-center justify-between px-3 py-2.5 rounded-md text-sm font-bold text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                                <div className="flex items-center gap-3">
                                    <group.icon className="h-5 w-5"/>
                                    <span>{group.title}</span>
                                </div>
                                <ChevronDownIcon className={`h-5 w-5 transition-transform ${openSection === group.title ? 'rotate-180' : ''}`} />
                            </button>
                            {openSection === group.title && (
                                <ul className="pl-4 mt-1 space-y-1 border-l-2 border-gray-200 dark:border-gray-700 ml-4">
                                    {group.items.map(item => (
                                        <li key={item.view}>
                                            <button
                                                onClick={() => setActiveView(item.view as View)}
                                                className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                                                    activeView === item.view ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                                                }`}
                                            >
                                                <item.icon className="h-5 w-5" />
                                                {item.label}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ))}
                </nav>

                <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                     <button onClick={() => setActiveView('settings')} className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${activeView === 'settings' ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                        <CogIcon className="h-5 w-5" />
                        Paramètres
                    </button>
                    <button onClick={toggleTheme} className="w-full flex items-center justify-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600">
                        {theme === 'light' ? <MoonIcon className="h-5 w-5" /> : <SunIcon className="h-5 w-5" />}
                        <span>{theme === 'light' ? 'Mode Sombre' : 'Mode Clair'}</span>
                    </button>
                </div>
            </aside>
            <main className="flex-1 p-6 overflow-y-auto">
                 <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold capitalize text-gray-800 dark:text-gray-200">{activeView.replace(/_/g, ' ')}</h2>
                    {activeView === 'quotes' && <button onClick={() => { setQuoteToEdit(null); setIsQuoteFormOpen(true); }} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md">Nouveau Devis</button>}
                    {activeView === 'clients' && <button onClick={() => { setClientToEdit(null); setIsClientFormOpen(true); }} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md">Ajouter un Client</button>}
                    {activeView === 'templates' && <button onClick={() => { setTemplateToEdit(null); setIsTemplateFormOpen(true); }} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md">Nouvelle Intervention</button>}
                    {activeView === 'technicians' && <button onClick={() => { setTechnicianToEdit(null); setIsTechnicianFormOpen(true); }} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md">Ajouter un Technicien</button>}
                    {activeView === 'purchase_orders' && <button onClick={() => { setPOToEdit(null); setIsPOFormOpen(true); }} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md">Nouvelle Commande</button>}
                </div>
                {renderView()}
            </main>

            {/* Modals */}
            <QuoteForm
                isOpen={isQuoteFormOpen}
                onClose={() => setIsQuoteFormOpen(false)}
                onSave={handleSaveQuote}
                clients={clients}
                interventionTemplates={interventionTemplates}
                parts={parts}
                existingQuote={quoteToEdit}
                nextQuoteNumber={nextQuoteNumber}
            />
            <ClientForm 
                isOpen={isClientFormOpen}
                onClose={() => setIsClientFormOpen(false)}
                onSave={handleSaveClient}
                existingClient={clientToEdit}
                onViewInvoice={handleViewInvoiceFromRepairOrder}
            />
            <Modal isOpen={!!quoteToView} onClose={() => setQuoteToView(null)} title={`Détails Devis ${quoteToView?.quoteNumber}`}>
                <QuoteView 
                    quote={quoteToView}
                    client={currentClient}
                    vehicle={currentVehicle}
                    settings={settings}
                    appointment={appointments.find(a => a.quoteId === quoteToView?.id)}
                    repairOrder={repairOrders.find(ro => ro.quote.id === quoteToView?.id)}
                    onViewRepairOrder={(order) => { setQuoteToView(null); setOrderToView(order); }}
                    onViewInScheduler={() => { setQuoteToView(null); setActiveView('scheduler'); }}
                />
            </Modal>
             <Modal isOpen={!!orderToView} onClose={() => setOrderToView(null)} title={`Détails Fiche Réparation ${orderToView?.quote.quoteNumber.replace('DEV', 'FICHE')}`}>
                <RepairOrderView
                    order={orderToView}
                    client={clients.find(c => c.id === orderToView?.quote.clientId) || null}
                    vehicle={clients.find(c => c.id === orderToView?.quote.clientId)?.vehicles.find(v => v.id === orderToView?.quote.vehicleId) || null}
                    settings={settings}
                    technicians={technicians}
                    technicianWorkload={technicianWorkload}
                    onUpdateStatus={handleUpdateRepairOrderStatus}
                    onAddInspection={orderId => { setOrderForInspection(repairOrders.find(ro => ro.id === orderId) || null); setIsInspectionFormOpen(true); }}
                    onGenerateInvoice={handleGenerateInvoice}
                    invoice={invoices.find(i => i.quote.id === orderToView?.quote.id)}
                    onViewInvoice={invoice => { setOrderToView(null); setInvoiceToView(invoice); }}
                    onAssignTechnician={handleAssignTechnician}
                    onSaveNotes={handleSaveRepairOrderNotes}
                    onSaveMileage={handleSaveRepairOrderMileage}
                />
            </Modal>
            <Modal isOpen={!!invoiceToView} onClose={() => setInvoiceToView(null)} title={`Détails Facture ${invoiceToView?.invoiceNumber}`}>
                <InvoiceView
                    invoice={invoiceToView}
                    client={clients.find(c => c.id === invoiceToView?.quote.clientId) || null}
                    vehicle={clients.find(c => c.id === invoiceToView?.quote.clientId)?.vehicles.find(v => v.id === invoiceToView?.quote.vehicleId) || null}
                    settings={settings}
                    onMarkAsPaid={invoice => { setInvoiceToView(null); setInvoiceForPayment(invoice); setIsPaymentFormOpen(true); }}
                />
            </Modal>
            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title={`Confirmer la suppression`}
            >
                Êtes-vous sûr de vouloir supprimer "{itemToDelete?.name}" ? Cette action est irréversible.
            </ConfirmationModal>
            <StatusChangeModal
                isOpen={isStatusModalOpen}
                onClose={() => setIsStatusModalOpen(false)}
                onConfirm={handleStatusChange}
                quoteForStatusChange={quoteForStatusChange}
            />
            <AppointmentForm
                isOpen={isAppointmentFormOpen}
                onClose={() => setIsAppointmentFormOpen(false)}
                onSave={handleSaveAppointment}
                quoteToSchedule={quoteToSchedule}
                clients={clients}
            />
             <VehicleInspectionForm
                isOpen={isInspectionFormOpen}
                onClose={() => setIsInspectionFormOpen(false)}
                onSave={handleSaveInspection}
                repairOrderNumber={orderForInspection?.quote.quoteNumber.replace('DEV', 'FICHE') || ''}
            />
             <PaymentForm 
                isOpen={isPaymentFormOpen}
                onClose={() => setIsPaymentFormOpen(false)}
                onSave={handleMarkInvoiceAsPaid}
                invoice={invoiceForPayment}
            />
            <InterventionTemplateForm
                isOpen={isTemplateFormOpen}
                onClose={() => { setIsTemplateFormOpen(false); setTemplateToEdit(null); }}
                onSave={handleSaveTemplate}
                parts={parts}
                existingTemplate={templateToEdit}
            />
            <TechnicianForm 
                isOpen={isTechnicianFormOpen}
                onClose={() => { setIsTechnicianFormOpen(false); setTechnicianToEdit(null); }}
                onSave={handleSaveTechnician}
                existingTechnician={technicianToEdit}
            />
             <PartForm 
                isOpen={isPartFormOpen}
                onClose={() => { setIsPartFormOpen(false); setPartToEdit(null); }}
                onSave={handleSavePart}
                existingPart={partToEdit}
            />
            <PurchaseOrderForm
                isOpen={isPOFormOpen}
                onClose={() => { setIsPOFormOpen(false); setPOToEdit(null); }}
                onSave={handleSavePurchaseOrder}
                parts={parts}
                existingOrder={poToEdit}
                // FIX: Correct variable name from nextOrderNumber to nextPurchaseOrderNumber
                nextOrderNumber={nextPurchaseOrderNumber}
            />
            <PurchaseOrderPaymentForm
                isOpen={isPOPaymentFormOpen}
                onClose={() => { setIsPOPaymentFormOpen(false); setPOForPayment(null); }}
                onSave={handleMarkPOAsPaid}
                order={poForPayment}
            />
        </div>
    );
};

export default App;