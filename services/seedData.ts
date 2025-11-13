// services/seedData.ts
import { Client, Part, Technician, InterventionTemplate, PurchaseOrder, Quote, Appointment, RepairOrder, Invoice, FinancialTransaction, VehicleServiceHistory } from '../types';

// --- HELPERS ---
const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const calculatePartSellingPrice = (part: Part): number => {
    if (part.pricingMethod === 'markup' && part.markupPercentage) {
        return part.purchasePrice * (1 + part.markupPercentage / 100);
    }
    return part.sellingPrice || part.purchasePrice;
};

const TODAY = new Date();

// --- BASE DATA ---
const SUPPLIERS = ['Auto Distribution', 'Mister Auto', 'Oscaro', 'Valeo Service', 'Bosch Automotive'];

export const seedTechnicians: Technician[] = [
    { id: 'tech-1', name: 'Marc Lavoine', specialty: 'Moteur & Distribution', email: 'marc@garage.com', phone: '0711223344', hireDate: '2022-01-15T00:00:00.000Z' },
    { id: 'tech-2', name: 'Sophie Marceau', specialty: 'Électronique & Diagnostic', email: 'sophie@garage.com', phone: '0755667788', hireDate: '2021-06-01T00:00:00.000Z' },
    { id: 'tech-3', name: 'Julien Clerc', specialty: 'Pneumatique & Freinage', email: 'julien@garage.com', phone: '0799887766', hireDate: '2023-03-10T00:00:00.000Z' },
    { id: 'tech-4', name: 'Vanessa Paradis', specialty: 'Climatisation & Entretien général', email: 'vanessa@garage.com', phone: '0712345678', hireDate: '2023-08-01T00:00:00.000Z' },
];

export const seedParts: Part[] = [
    { id: 'part-1', name: 'Filtre à huile', reference: 'BOS-0451103379', supplier: SUPPLIERS[4], stock: 42, purchasePrice: 8.50, pricingMethod: 'markup', markupPercentage: 50 },
    { id: 'part-2', name: 'Plaquettes de frein AV', reference: 'BRE-P23139', supplier: SUPPLIERS[0], stock: 18, purchasePrice: 35.00, pricingMethod: 'fixed', sellingPrice: 60.00 },
    { id: 'part-3', name: 'Huile Moteur 5W30 (5L)', reference: 'TOT-QUARTZ9000', supplier: SUPPLIERS[1], stock: 25, purchasePrice: 25.00, pricingMethod: 'markup', markupPercentage: 60 },
    { id: 'part-4', name: 'Kit distribution + pompe', reference: 'GAT-KP15631XS', supplier: SUPPLIERS[2], stock: 7, purchasePrice: 95.00, pricingMethod: 'fixed', sellingPrice: 160.00 },
    { id: 'part-5', name: 'Bougie d\'allumage Iridium', reference: 'NGK-96543', supplier: SUPPLIERS[0], stock: 80, purchasePrice: 12.00, pricingMethod: 'markup', markupPercentage: 100 },
    { id: 'part-6', name: 'Filtre à air', reference: 'PUR-A1263', supplier: SUPPLIERS[1], stock: 3, purchasePrice: 15.00, pricingMethod: 'markup', markupPercentage: 50 },
    { id: 'part-7', name: 'Disques de frein AV', reference: 'BRE-0986479058', supplier: SUPPLIERS[0], stock: 9, purchasePrice: 80.00, pricingMethod: 'fixed', sellingPrice: 150.00 },
    { id: 'part-8', name: 'Amortisseurs AV (Paire)', reference: 'MON-G8092', supplier: SUPPLIERS[2], stock: 0, purchasePrice: 120.00, pricingMethod: 'markup', markupPercentage: 50 },
    { id: 'part-9', name: 'Kit d\'embrayage', reference: 'VAL-826350', supplier: SUPPLIERS[3], stock: 4, purchasePrice: 250.00, pricingMethod: 'markup', markupPercentage: 40 },
    { id: 'part-10', name: 'Pneu Michelin Primacy 4', reference: 'MIC-205551691V', supplier: SUPPLIERS[0], stock: 12, purchasePrice: 90.00, pricingMethod: 'fixed', sellingPrice: 125.00 },
    { id: 'part-11', name: 'Batterie Varta Blue 74Ah', reference: 'VAR-574012068', supplier: SUPPLIERS[4], stock: 8, purchasePrice: 75.00, pricingMethod: 'markup', markupPercentage: 40 },
    { id: 'part-12', name: 'Filtre d\'habitacle charbon', reference: 'BOS-1987432314', supplier: SUPPLIERS[4], stock: 35, purchasePrice: 18.00, pricingMethod: 'markup', markupPercentage: 60 },
    { id: 'part-13', name: 'Alternateur', reference: 'BOS-0986041810', supplier: SUPPLIERS[4], stock: 2, purchasePrice: 180.00, pricingMethod: 'fixed', sellingPrice: 320.00 },
    { id: 'part-14', name: 'Démarreur', reference: 'VAL-438171', supplier: SUPPLIERS[3], stock: 3, purchasePrice: 150.00, pricingMethod: 'fixed', sellingPrice: 280.00 },
    { id: 'part-15', name: 'Liquide de refroidissement (5L)', reference: 'MOT-INUGEL', supplier: SUPPLIERS[1], stock: 22, purchasePrice: 15.00, pricingMethod: 'markup', markupPercentage: 70 },
];

export const seedClients: Client[] = [
    { id: 'c1', name: 'Alice Martin', email: 'alice.martin@example.com', phone: '0601020304', address: '1 Rue de la Liberté', postalCode: '75001', city: 'Paris', vehicles: [
        { id: 'v1', licensePlate: 'AA-123-BB', make: 'Renault', model: 'Clio V', serviceHistory: [] },
        { id: 'v2', licensePlate: 'BB-456-CC', make: 'BMW', model: 'Serie 1', serviceHistory: [] },
    ]},
    { id: 'c2', name: 'Bob Leclerc', email: 'bob.leclerc@example.com', phone: '0611223344', address: '2 Avenue des Peupliers', postalCode: '69002', city: 'Lyon', vehicles: [
        { id: 'v3', licensePlate: 'CC-789-DD', make: 'Peugeot', model: '208', serviceHistory: [] },
    ]},
    { id: 'c3', name: 'Chloé Dubois', email: 'chloe.dubois@example.com', phone: '0622334455', address: '3 Place du Capitole', postalCode: '31000', city: 'Toulouse', vehicles: [
        { id: 'v4', licensePlate: 'DD-111-EE', make: 'Citroën', model: 'C3', serviceHistory: [] },
        { id: 'v5', licensePlate: 'EE-222-FF', make: 'Dacia', model: 'Sandero', serviceHistory: [] },
    ]},
    { id: 'c4', name: 'David Garcia', email: 'david.garcia@example.com', phone: '0633445566', address: '4 Quai de la Joliette', postalCode: '13002', city: 'Marseille', vehicles: [
        { id: 'v6', licensePlate: 'FF-333-GG', make: 'Volkswagen', model: 'Golf 8', serviceHistory: [] },
    ]},
    { id: 'c5', name: 'Eva Bernard', email: 'eva.bernard@example.com', phone: '0644556677', address: '5 Rue de la République', postalCode: '59000', city: 'Lille', vehicles: [
        { id: 'v7', licensePlate: 'GG-444-HH', make: 'Toyota', model: 'Yaris', serviceHistory: [] },
    ]},
];

// --- TEMPLATES ---
export const seedInterventionTemplates: InterventionTemplate[] = [
    { id: 'tpl-1', name: 'Forfait Vidange Simple', laborItems: [{ description: "Vidange et remplacement filtre à huile", hours: 1, rate: 60, partItems: [{ id: 'pi-1', partId: 'part-1', description: 'Filtre à huile', quantity: 1, unitPrice: calculatePartSellingPrice(seedParts.find(p=>p.id==='part-1')!) }, { id: 'pi-2', partId: 'part-3', description: 'Huile Moteur 5W30 (5L)', quantity: 1, unitPrice: calculatePartSellingPrice(seedParts.find(p=>p.id==='part-3')!) }] }] },
    { id: 'tpl-2', name: 'Remplacement Plaquettes AV', laborItems: [{ description: "Remplacement plaquettes de frein avant", hours: 1.5, rate: 65, partItems: [{ id: 'pi-3', partId: 'part-2', description: 'Plaquettes de frein AV', quantity: 1, unitPrice: calculatePartSellingPrice(seedParts.find(p=>p.id==='part-2')!) }] }] },
    { id: 'tpl-3', name: 'Remplacement Disques & Plaquettes AV', laborItems: [{ description: "Remplacement disques et plaquettes de frein avant", hours: 2, rate: 70, partItems: [{ id: 'pi-4', partId: 'part-7', description: 'Disques de frein AV', quantity: 2, unitPrice: calculatePartSellingPrice(seedParts.find(p=>p.id==='part-7')!) }, { id: 'pi-5', partId: 'part-2', description: 'Plaquettes de frein AV', quantity: 1, unitPrice: calculatePartSellingPrice(seedParts.find(p=>p.id==='part-2')!) }] }] },
    { id: 'tpl-4', name: 'Révision Complète', laborItems: [{ description: "Révision générale: vidange, 3 filtres, contrôles", hours: 2.5, rate: 70, partItems: [{ id: 'pi-6', partId: 'part-1', description: 'Filtre à huile', quantity: 1, unitPrice: calculatePartSellingPrice(seedParts.find(p=>p.id==='part-1')!) }, { id: 'pi-7', partId: 'part-3', description: 'Huile Moteur 5W30 (5L)', quantity: 1, unitPrice: calculatePartSellingPrice(seedParts.find(p=>p.id==='part-3')!) }, { id: 'pi-8', partId: 'part-6', description: 'Filtre à air', quantity: 1, unitPrice: calculatePartSellingPrice(seedParts.find(p=>p.id==='part-6')!) }, { id: 'pi-9', partId: 'part-12', description: 'Filtre d\'habitacle charbon', quantity: 1, unitPrice: calculatePartSellingPrice(seedParts.find(p=>p.id==='part-12')!) }] }] },
    { id: 'tpl-5', name: 'Remplacement Kit Distribution', laborItems: [{ description: "Remplacement kit de distribution et pompe à eau", hours: 4, rate: 75, partItems: [{ id: 'pi-10', partId: 'part-4', description: 'Kit distribution + pompe', quantity: 1, unitPrice: calculatePartSellingPrice(seedParts.find(p=>p.id==='part-4')!) }] }] },
    { id: 'tpl-6', name: 'Remplacement Batterie', laborItems: [{ description: "Dépose/repose et test batterie", hours: 0.5, rate: 50, partItems: [{ id: 'pi-11', partId: 'part-11', description: 'Batterie Varta Blue 74Ah', quantity: 1, unitPrice: calculatePartSellingPrice(seedParts.find(p=>p.id==='part-11')!) }] }] },
    { id: 'tpl-7', name: 'Remplacement 2 Pneus', laborItems: [{ description: "Montage, équilibrage, valve pour 2 pneus", hours: 1, rate: 60, partItems: [{ id: 'pi-12', partId: 'part-10', description: 'Pneu Michelin Primacy 4', quantity: 2, unitPrice: calculatePartSellingPrice(seedParts.find(p=>p.id==='part-10')!) }] }] },
    { id: 'tpl-8', name: 'Remplacement Amortisseurs AV', laborItems: [{ description: "Remplacement des 2 amortisseurs avant", hours: 2.5, rate: 70, partItems: [{ id: 'pi-13', partId: 'part-8', description: 'Amortisseurs AV (Paire)', quantity: 1, unitPrice: calculatePartSellingPrice(seedParts.find(p=>p.id==='part-8')!) }] }] },
];

// --- DYNAMIC DATA GENERATION ---
const quotes: Quote[] = [];
const appointments: Appointment[] = [];
const repairOrders: RepairOrder[] = [];
const invoices: Invoice[] = [];
const financialTransactions: FinancialTransaction[] = [];
const serviceHistories: { [vehicleId: string]: VehicleServiceHistory[] } = {};

// SCENARIO 1: Quote -> Approved -> Scheduled -> In Progress
const q1_date = addDays(TODAY, -10);
const q1: Quote = { id: 'q1', quoteNumber: 'DEV-00101', clientId: 'c1', vehicleId: 'v1', date: q1_date.toISOString(), validityDuration: 30, taxRate: 20, status: 'approved', statusHistory: [{status: 'draft', date: q1_date.toISOString()}, {status: 'sent', date: q1_date.toISOString()}, {status: 'approved', date: addDays(q1_date, 2).toISOString()}], isConvertedToRepairOrder: true, laborItems: seedInterventionTemplates.find(t=>t.id==='tpl-1')!.laborItems.map(li => ({...li, id: crypto.randomUUID()})) };
quotes.push(q1);
const appt1_date = addDays(TODAY, -5);
const appt1: Appointment = { id: 'appt1', title: `Vidange - Clio V`, start: appt1_date.toISOString(), end: addDays(appt1_date, 1/24 * 2).toISOString(), quoteId: 'q1', clientId: 'c1', vehicleId: 'v1' };
appointments.push(appt1);
const ro1: RepairOrder = { id: 'ro1', quote: q1, status: 'in_progress', technicianId: 'tech-1', mileage: 34500, notes: 'Le client signale un bruit de claquement au démarrage.' };
repairOrders.push(ro1);

// SCENARIO 2: Quote -> Approved -> Scheduled -> Waiting for Part (Amortisseurs stock=0)
const q2_date = addDays(TODAY, -8);
const q2: Quote = { id: 'q2', quoteNumber: 'DEV-00102', clientId: 'c2', vehicleId: 'v3', date: q2_date.toISOString(), validityDuration: 30, taxRate: 20, status: 'approved', statusHistory: [{status: 'draft', date: q2_date.toISOString()}, {status: 'sent', date: q2_date.toISOString()}, {status: 'approved', date: addDays(q2_date, 1).toISOString()}], isConvertedToRepairOrder: true, laborItems: seedInterventionTemplates.find(t=>t.id==='tpl-8')!.laborItems.map(li => ({...li, id: crypto.randomUUID()})) };
quotes.push(q2);
const appt2_date = addDays(TODAY, -2);
const appt2: Appointment = { id: 'appt2', title: `Amortisseurs - 208`, start: appt2_date.toISOString(), end: addDays(appt2_date, 1/24 * 3).toISOString(), quoteId: 'q2', clientId: 'c2', vehicleId: 'v3' };
appointments.push(appt2);
const ro2: RepairOrder = { id: 'ro2', quote: q2, status: 'waiting_for_part', technicianId: 'tech-3', mileage: 89000 };
repairOrders.push(ro2);

// SCENARIO 3: Full flow -> Paid Invoice
const q3_date = addDays(TODAY, -45);
const q3: Quote = { id: 'q3', quoteNumber: 'DEV-00103', clientId: 'c3', vehicleId: 'v4', date: q3_date.toISOString(), validityDuration: 30, taxRate: 20, status: 'approved', statusHistory: [{status: 'draft', date: q3_date.toISOString()}, {status: 'sent', date: q3_date.toISOString()}, {status: 'approved', date: addDays(q3_date, 5).toISOString()}], isConvertedToRepairOrder: true, laborItems: seedInterventionTemplates.find(t=>t.id==='tpl-3')!.laborItems.map(li => ({...li, id: crypto.randomUUID()})) };
quotes.push(q3);
const appt3_date = addDays(TODAY, -35);
const appt3: Appointment = { id: 'appt3', title: `Freinage - C3`, start: appt3_date.toISOString(), end: addDays(appt3_date, 1/24 * 2.5).toISOString(), quoteId: 'q3', clientId: 'c3', vehicleId: 'v4' };
appointments.push(appt3);
const ro3: RepairOrder = { id: 'ro3', quote: q3, status: 'invoiced', technicianId: 'tech-3', mileage: 62300 };
repairOrders.push(ro3);
const inv3_date = addDays(TODAY, -34);
const inv3: Invoice = { id: 'inv1', invoiceNumber: 'FAC-2024-0001', quote: q3, date: inv3_date.toISOString(), dueDate: addDays(inv3_date, 30).toISOString(), status: 'paid', paymentDetails: { date: addDays(TODAY, -20).toISOString(), method: 'card'} };
invoices.push(inv3);
const total3 = inv3.quote.laborItems.reduce((acc, l) => acc + (l.hours * l.rate) + l.partItems.reduce((pAcc, p) => pAcc + (p.quantity * p.unitPrice), 0), 0) * (1 + inv3.quote.taxRate/100);
financialTransactions.push({ id: 'ft1', date: inv3.paymentDetails!.date, type: 'revenue', amount: total3, description: `Facture FAC-2024-0001`, referenceId: inv3.id });
if (!serviceHistories[q3.vehicleId]) serviceHistories[q3.vehicleId] = [];
serviceHistories[q3.vehicleId].push({id: 'sh1', date: inv3.date, mileage: ro3.mileage!, description: 'Remplacement Disques & Plaquettes AV', referenceId: ro3.id });

// SCENARIO 4: Full flow -> Unpaid Invoice (Due)
const q4_date = addDays(TODAY, -60);
const q4: Quote = { id: 'q4', quoteNumber: 'DEV-00104', clientId: 'c4', vehicleId: 'v6', date: q4_date.toISOString(), validityDuration: 30, taxRate: 20, status: 'approved', statusHistory: [{status: 'draft', date: q4_date.toISOString()}, {status: 'sent', date: q4_date.toISOString()}, {status: 'approved', date: addDays(q4_date, 3).toISOString()}], isConvertedToRepairOrder: true, laborItems: seedInterventionTemplates.find(t=>t.id==='tpl-5')!.laborItems.map(li => ({...li, id: crypto.randomUUID()})) };
quotes.push(q4);
const appt4_date = addDays(TODAY, -50);
const appt4: Appointment = { id: 'appt4', title: `Distribution - Golf 8`, start: appt4_date.toISOString(), end: addDays(appt4_date, 1/24 * 5).toISOString(), quoteId: 'q4', clientId: 'c4', vehicleId: 'v6' };
appointments.push(appt4);
const ro4: RepairOrder = { id: 'ro4', quote: q4, status: 'invoiced', technicianId: 'tech-1', mileage: 121000 };
repairOrders.push(ro4);
const inv4_date = addDays(TODAY, -48);
const inv4: Invoice = { id: 'inv2', invoiceNumber: 'FAC-2024-0002', quote: q4, date: inv4_date.toISOString(), dueDate: addDays(inv4_date, 30).toISOString(), status: 'draft' };
invoices.push(inv4);
if (!serviceHistories[q4.vehicleId]) serviceHistories[q4.vehicleId] = [];
serviceHistories[q4.vehicleId].push({id: 'sh2', date: inv4.date, mileage: ro4.mileage!, description: 'Remplacement Kit Distribution', referenceId: ro4.id });

// SCENARIO 5: Simple Sent Quote
const q5_date = addDays(TODAY, -3);
const q5: Quote = { id: 'q5', quoteNumber: 'DEV-00105', clientId: 'c5', vehicleId: 'v7', date: q5_date.toISOString(), validityDuration: 30, taxRate: 20, status: 'sent', statusHistory: [{status: 'draft', date: q5_date.toISOString()}, {status: 'sent', date: q5_date.toISOString()}], laborItems: seedInterventionTemplates.find(t=>t.id==='tpl-2')!.laborItems.map(li => ({...li, id: crypto.randomUUID()})) };
quotes.push(q5);

// SCENARIO 6: Draft Quote
const q6: Quote = { id: 'q6', quoteNumber: 'DEV-00106', clientId: 'c1', vehicleId: 'v2', date: TODAY.toISOString(), validityDuration: 30, taxRate: 20, status: 'draft', statusHistory: [{status: 'draft', date: TODAY.toISOString()}], laborItems: seedInterventionTemplates.find(t=>t.id==='tpl-4')!.laborItems.map(li => ({...li, id: crypto.randomUUID()})) };
quotes.push(q6);

// SCENARIO 7: Rejected Quote
const q7_date = addDays(TODAY, -15);
const q7: Quote = { id: 'q7', quoteNumber: 'DEV-00107', clientId: 'c3', vehicleId: 'v5', date: q7_date.toISOString(), validityDuration: 30, taxRate: 20, status: 'rejected', statusHistory: [{status: 'draft', date: q7_date.toISOString()}, {status: 'sent', date: q7_date.toISOString()}, {status: 'rejected', date: addDays(q7_date, 4).toISOString()}], laborItems: seedInterventionTemplates.find(t=>t.id==='tpl-7')!.laborItems.map(li => ({...li, id: crypto.randomUUID()})) };
quotes.push(q7);

// SCENARIO 8: Approved, but not yet scheduled
const q8_date = addDays(TODAY, -1);
const q8: Quote = { id: 'q8', quoteNumber: 'DEV-00108', clientId: 'c2', vehicleId: 'v3', date: q8_date.toISOString(), validityDuration: 30, taxRate: 20, status: 'approved', statusHistory: [{status: 'draft', date: q8_date.toISOString()}, {status: 'sent', date: q8_date.toISOString()}, {status: 'approved', date: TODAY.toISOString()}], isConvertedToRepairOrder: false, laborItems: seedInterventionTemplates.find(t=>t.id==='tpl-6')!.laborItems.map(li => ({...li, id: crypto.randomUUID()})) };
quotes.push(q8);


// Integrate service histories into clients
seedClients.forEach(c => {
    c.vehicles.forEach(v => {
        if (serviceHistories[v.id]) {
            v.serviceHistory.push(...serviceHistories[v.id]);
        }
    });
});

// --- PURCHASE ORDERS ---
export const seedPurchaseOrders: PurchaseOrder[] = [
    { id: 'po1', orderNumber: 'CMD-00201', supplier: SUPPLIERS[2], date: addDays(TODAY, -20).toISOString(), expectedDeliveryDate: addDays(TODAY, -12).toISOString(), status: 'received', items: [{id: 'poi1', partId: 'part-8', quantity: 5, unitPrice: 120.00}], isPaid: true, paymentDate: addDays(TODAY, -10).toISOString()},
    { id: 'po2', orderNumber: 'CMD-00202', supplier: SUPPLIERS[1], date: addDays(TODAY, -5).toISOString(), expectedDeliveryDate: addDays(TODAY, 2).toISOString(), status: 'ordered', items: [{id: 'poi2', partId: 'part-6', quantity: 10, unitPrice: 15.00}], isPaid: false },
    { id: 'po3', orderNumber: 'CMD-00203', supplier: SUPPLIERS[0], date: addDays(TODAY, -40).toISOString(), expectedDeliveryDate: addDays(TODAY, -30).toISOString(), status: 'received', items: [{id: 'poi3', partId: 'part-10', quantity: 8, unitPrice: 90.00}], isPaid: true, paymentDate: addDays(TODAY, -25).toISOString()},
    { id: 'po4', orderNumber: 'CMD-00204', supplier: SUPPLIERS[4], date: addDays(TODAY, -65).toISOString(), expectedDeliveryDate: addDays(TODAY, -55).toISOString(), status: 'received', items: [{id: 'poi4', partId: 'part-11', quantity: 10, unitPrice: 75.00}], isPaid: true, paymentDate: addDays(TODAY, -50).toISOString()},
    { id: 'po5', orderNumber: 'CMD-00205', supplier: SUPPLIERS[3], date: addDays(TODAY, -1).toISOString(), expectedDeliveryDate: addDays(TODAY, 7).toISOString(), status: 'draft', items: [{id: 'poi5', partId: 'part-9', quantity: 2, unitPrice: 250.00}], isPaid: false },
];
seedPurchaseOrders.filter(po => po.isPaid).forEach(po => {
    const total = po.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
    financialTransactions.push({ id: `ft-po-${po.id}`, date: po.paymentDate!, type: 'expense', amount: -total, description: `Commande ${po.orderNumber}`, referenceId: po.id });
});


// Final export
export const seedQuotes: Quote[] = quotes;
export const seedAppointments: Appointment[] = appointments;
export const seedRepairOrders: RepairOrder[] = repairOrders;
export const seedInvoices: Invoice[] = invoices;
export const seedFinancialTransactions: FinancialTransaction[] = financialTransactions;
