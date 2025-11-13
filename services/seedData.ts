// services/seedData.ts
import { Client, Part, Technician, InterventionTemplate, PurchaseOrder, Quote, Appointment, RepairOrder, Invoice, FinancialTransaction } from '../types';

// --- HELPERS ---
const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const TODAY = new Date();
const YESTERDAY = addDays(TODAY, -1);
const LAST_WEEK = addDays(TODAY, -7);
const LAST_MONTH = addDays(TODAY, -30);
const TWO_MONTHS_AGO = addDays(TODAY, -60);

// --- SUPPLIERS (Not a model, but used for parts) ---
const SUPPLIERS = ['Auto Distribution', 'Mister Auto', 'Oscaro', 'Valeo Service', 'Bosch Automotive'];

// --- TECHNICIANS (3) ---
export const seedTechnicians: Technician[] = [
    { id: 'tech-1', name: 'Marc Lavoine', specialty: 'Moteur', email: 'marc@garage.com', phone: '0711223344', hireDate: '2022-01-15T00:00:00.000Z' },
    { id: 'tech-2', name: 'Sophie Marceau', specialty: 'Électronique', email: 'sophie@garage.com', phone: '0755667788', hireDate: '2021-06-01T00:00:00.000Z' },
    { id: 'tech-3', name: 'Julien Clerc', specialty: 'Pneumatique et Freinage', email: 'julien@garage.com', phone: '0799887766', hireDate: '2023-03-10T00:00:00.000Z' },
];

// --- PARTS (20) ---
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
    { id: 'part-16', name: 'Jeu de 4 balais d\'essuie-glace', reference: 'BOS-AEROTWIN', supplier: SUPPLIERS[4], stock: 15, purchasePrice: 22.00, pricingMethod: 'markup', markupPercentage: 50 },
    { id: 'part-17', name: 'Sonde Lambda', reference: 'NGK-1952', supplier: SUPPLIERS[0], stock: 6, purchasePrice: 55.00, pricingMethod: 'markup', markupPercentage: 60 },
    { id: 'part-18', name: 'Cardan', reference: 'SKF-VKJC1039', supplier: SUPPLIERS[2], stock: 1, purchasePrice: 110.00, pricingMethod: 'fixed', sellingPrice: 200.00 },
    { id: 'part-19', name: 'Compresseur de climatisation', reference: 'VAL-813722', supplier: SUPPLIERS[3], stock: 2, purchasePrice: 350.00, pricingMethod: 'markup', markupPercentage: 40 },
    { id: 'part-20', name: 'Radiateur moteur', reference: 'NRF-58477', supplier: SUPPLIERS[1], stock: 3, purchasePrice: 130.00, pricingMethod: 'fixed', sellingPrice: 240.00 },
];

// --- INTERVENTION TEMPLATES (20) ---
export const seedInterventionTemplates: InterventionTemplate[] = [
    // FIX: Add missing 'description' property to all PartItem objects.
    { id: 'tpl-1', name: 'Forfait Vidange Simple', laborItems: [{ description: "Vidange et remplacement filtre à huile", hours: 1, rate: 60, partItems: [{ id: 'pi-1', partId: 'part-1', description: 'Filtre à huile', quantity: 1, unitPrice: 12.75 }, { id: 'pi-2', partId: 'part-3', description: 'Huile Moteur 5W30 (5L)', quantity: 1, unitPrice: 40.00 }] }] },
    { id: 'tpl-2', name: 'Remplacement Plaquettes AV', laborItems: [{ description: "Remplacement plaquettes de frein avant", hours: 1.5, rate: 65, partItems: [{ id: 'pi-3', partId: 'part-2', description: 'Plaquettes de frein AV', quantity: 1, unitPrice: 60.00 }] }] },
    { id: 'tpl-3', name: 'Remplacement Plaquettes et Disques AV', laborItems: [{ description: "Remplacement disques et plaquettes de frein avant", hours: 2, rate: 70, partItems: [{ id: 'pi-4', partId: 'part-7', description: 'Disques de frein AV', quantity: 2, unitPrice: 150.00 }, { id: 'pi-5', partId: 'part-2', description: 'Plaquettes de frein AV', quantity: 1, unitPrice: 60.00 }] }] },
    { id: 'tpl-4', name: 'Révision Complète', laborItems: [{ description: "Révision générale: vidange, 3 filtres, contrôles", hours: 2.5, rate: 70, partItems: [{ id: 'pi-6', partId: 'part-1', description: 'Filtre à huile', quantity: 1, unitPrice: 12.75 }, { id: 'pi-7', partId: 'part-3', description: 'Huile Moteur 5W30 (5L)', quantity: 1, unitPrice: 40.00 }, { id: 'pi-8', partId: 'part-6', description: 'Filtre à air', quantity: 1, unitPrice: 22.50 }, { id: 'pi-9', partId: 'part-12', description: 'Filtre d\'habitacle charbon', quantity: 1, unitPrice: 28.80 }] }] },
    { id: 'tpl-5', name: 'Remplacement Kit Distribution', laborItems: [{ description: "Remplacement kit de distribution et pompe à eau", hours: 4, rate: 75, partItems: [{ id: 'pi-10', partId: 'part-4', description: 'Kit distribution + pompe', quantity: 1, unitPrice: 160.00 }] }] },
    { id: 'tpl-6', name: 'Remplacement Batterie', laborItems: [{ description: "Dépose/repose et test batterie", hours: 0.5, rate: 50, partItems: [{ id: 'pi-11', partId: 'part-11', description: 'Batterie Varta Blue 74Ah', quantity: 1, unitPrice: 105.00 }] }] },
    { id: 'tpl-7', name: 'Remplacement 2 Pneus', laborItems: [{ description: "Montage, équilibrage, valve pour 2 pneus", hours: 1, rate: 60, partItems: [{ id: 'pi-12', partId: 'part-10', description: 'Pneu Michelin Primacy 4', quantity: 2, unitPrice: 125.00 }] }] },
    { id: 'tpl-8', name: 'Remplacement 4 Pneus', laborItems: [{ description: "Montage, équilibrage, valve pour 4 pneus", hours: 1.5, rate: 60, partItems: [{ id: 'pi-13', partId: 'part-10', description: 'Pneu Michelin Primacy 4', quantity: 4, unitPrice: 125.00 }] }] },
    { id: 'tpl-9', name: 'Remplacement Amortisseurs AV', laborItems: [{ description: "Remplacement des 2 amortisseurs avant", hours: 2.5, rate: 70, partItems: [{ id: 'pi-14', partId: 'part-8', description: 'Amortisseurs AV (Paire)', quantity: 1, unitPrice: 180.00 }] }] },
    { id: 'tpl-10', name: 'Remplacement Kit Embrayage', laborItems: [{ description: "Remplacement du kit d'embrayage", hours: 5, rate: 80, partItems: [{ id: 'pi-15', partId: 'part-9', description: 'Kit d\'embrayage', quantity: 1, unitPrice: 350.00 }] }] },
    { id: 'tpl-11', name: 'Diagnostic Électronique', laborItems: [{ description: "Passage à la valise et interprétation des codes défauts", hours: 1, rate: 80, partItems: [] }] },
    { id: 'tpl-12', name: 'Recharge Climatisation', laborItems: [{ description: "Recharge du circuit de climatisation (gaz R134a)", hours: 1, rate: 70, partItems: [] }] },
    { id: 'tpl-13', name: 'Remplacement Alternateur', laborItems: [{ description: "Remplacement de l'alternateur", hours: 2, rate: 75, partItems: [{ id: 'pi-16', partId: 'part-13', description: 'Alternateur', quantity: 1, unitPrice: 320.00 }] }] },
    { id: 'tpl-14', name: 'Remplacement Démarreur', laborItems: [{ description: "Remplacement du démarreur", hours: 1.5, rate: 75, partItems: [{ id: 'pi-17', partId: 'part-14', description: 'Démarreur', quantity: 1, unitPrice: 280.00 }] }] },
    { id: 'tpl-15', name: 'Purge liquide de frein', laborItems: [{ description: "Remplacement et purge du liquide de frein", hours: 1, rate: 65, partItems: [] }] },
    { id: 'tpl-16', name: 'Remplacement 4 bougies', laborItems: [{ description: "Remplacement des 4 bougies d'allumage", hours: 0.7, rate: 60, partItems: [{ id: 'pi-18', partId: 'part-5', description: 'Bougie d\'allumage Iridium', quantity: 4, unitPrice: 24.00 }] }] },
    { id: 'tpl-17', name: 'Changement essuie-glaces', laborItems: [{ description: "Remplacement balais d'essuie-glace AV/AR", hours: 0.2, rate: 50, partItems: [{ id: 'pi-19', partId: 'part-16', description: 'Jeu de 4 balais d\'essuie-glace', quantity: 1, unitPrice: 33.00 }] }] },
    { id: 'tpl-18', name: 'Contrôle et mise à niveau des liquides', laborItems: [{ description: "Contrôle de tous les niveaux et appoint", hours: 0.3, rate: 50, partItems: [] }] },
    { id: 'tpl-19', name: 'Remplacement Sonde Lambda', laborItems: [{ description: "Remplacement de la sonde Lambda", hours: 1, rate: 70, partItems: [{ id: 'pi-20', partId: 'part-17', description: 'Sonde Lambda', quantity: 1, unitPrice: 88.00 }] }] },
    { id: 'tpl-20', name: 'Remplacement Radiateur', laborItems: [{ description: "Remplacement du radiateur moteur et purge du circuit", hours: 3, rate: 75, partItems: [{ id: 'pi-21', partId: 'part-20', description: 'Radiateur moteur', quantity: 1, unitPrice: 240.00 }, { id: 'pi-22', partId: 'part-15', description: 'Liquide de refroidissement (5L)', quantity: 1, unitPrice: 25.50 }] }] },
];

// --- CLIENTS & VEHICLES (10) ---
export const seedClients: Client[] = [
    { id: 'c1', name: 'Alice Martin', email: 'alice.martin@example.com', phone: '0601020304', address: '1 Rue de la Liberté', postalCode: '75001', city: 'Paris', vehicles: [
        { id: 'v1', licensePlate: 'AA-123-BB', make: 'Renault', model: 'Clio V', serviceHistory: [{id: 'h1', date: addDays(TODAY, -150).toISOString(), mileage: 32000, description: 'Révision annuelle'}] },
        { id: 'v2', licensePlate: 'BB-456-CC', make: 'BMW', model: 'Serie 1', serviceHistory: [] },
    ]},
    { id: 'c2', name: 'Bob Leclerc', email: 'bob.leclerc@example.com', phone: '0611223344', address: '2 Avenue des Peupliers', postalCode: '69002', city: 'Lyon', vehicles: [
        { id: 'v3', licensePlate: 'CC-789-DD', make: 'Peugeot', model: '208', serviceHistory: [] },
    ]},
    { id: 'c3', name: 'Chloé Dubois', email: 'chloe.dubois@example.com', phone: '0622334455', address: '3 Place du Capitole', postalCode: '31000', city: 'Toulouse', vehicles: [
        { id: 'v4', licensePlate: 'DD-111-EE', make: 'Citroën', model: 'C3', serviceHistory: [] },
        { id: 'v5', licensePlate: 'EE-222-FF', make: 'Dacia', model: 'Sandero', serviceHistory: [{id: 'h2', date: addDays(TODAY, -400).toISOString(), mileage: 55000, description: 'Changement pneus avant'}] },
    ]},
    { id: 'c4', name: 'David Garcia', email: 'david.garcia@example.com', phone: '0633445566', address: '4 Quai de la Joliette', postalCode: '13002', city: 'Marseille', vehicles: [
        { id: 'v6', licensePlate: 'FF-333-GG', make: 'Volkswagen', model: 'Golf 8', serviceHistory: [] },
    ]},
    { id: 'c5', name: 'Eva Bernard', email: 'eva.bernard@example.com', phone: '0644556677', address: '5 Rue de la République', postalCode: '59000', city: 'Lille', vehicles: [
        { id: 'v7', licensePlate: 'GG-444-HH', make: 'Toyota', model: 'Yaris', serviceHistory: [] },
        { id: 'v8', licensePlate: 'HH-555-II', make: 'Ford', model: 'Puma', serviceHistory: [] },
        { id: 'v9', licensePlate: 'II-666-JJ', make: 'Fiat', model: '500', serviceHistory: [{id: 'h3', date: addDays(TODAY, -90).toISOString(), mileage: 15000, description: 'Vidange simple'}] },
    ]},
    { id: 'c6', name: 'Frank Moreau', email: 'frank.moreau@example.com', phone: '0655667788', address: '6 Cours de l\'Intendance', postalCode: '33000', city: 'Bordeaux', vehicles: [
        { id: 'v10', licensePlate: 'JJ-777-KK', make: 'Audi', model: 'A3', serviceHistory: [] },
    ]},
    { id: 'c7', name: 'Grace Petit', email: 'grace.petit@example.com', phone: '0666778899', address: '7 Place Stanislas', postalCode: '54000', city: 'Nancy', vehicles: [
        { id: 'v11', licensePlate: 'KK-888-LL', make: 'Opel', model: 'Corsa', serviceHistory: [] },
        { id: 'v12', licensePlate: 'LL-999-MM', make: 'Kia', model: 'Stonic', serviceHistory: [] },
    ]},
    { id: 'c8', name: 'Heidi Durand', email: 'heidi.durand@example.com', phone: '0677889900', address: '8 Promenade des Anglais', postalCode: '06000', city: 'Nice', vehicles: [
        { id: 'v13', licensePlate: 'MM-111-NN', make: 'Hyundai', model: 'i20', serviceHistory: [] },
    ]},
    { id: 'c9', name: 'Ivan Leroy', email: 'ivan.leroy@example.com', phone: '0688990011', address: '9 Rue Nationale', postalCode: '37000', city: 'Tours', vehicles: [
        { id: 'v14', licensePlate: 'NN-222-OO', make: 'Mercedes', model: 'Classe A', serviceHistory: [{id: 'h4', date: addDays(TODAY, -250).toISOString(), mileage: 45000, description: 'Plaquettes de frein'}] },
        { id: 'v15', licensePlate: 'OO-333-PP', make: 'Nissan', model: 'Juke', serviceHistory: [] },
        { id: 'v16', licensePlate: 'PP-444-QQ', make: 'Skoda', model: 'Fabia', serviceHistory: [] },
        { id: 'v17', licensePlate: 'QQ-555-RR', make: 'Seat', model: 'Ibiza', serviceHistory: [] },
    ]},
    { id: 'c10', name: 'Judy Roux', email: 'judy.roux@example.com', phone: '0699001122', address: '10 Place de la Comédie', postalCode: '34000', city: 'Montpellier', vehicles: [
        { id: 'v18', licensePlate: 'RR-666-SS', make: 'Mini', model: 'Cooper', serviceHistory: [] },
    ]},
];

// --- QUOTES (20) ---
// FIX: Add a unique 'id' to each LaborTask when creating a quote from a template.
export const seedQuotes: Quote[] = [
    // Approved -> Invoiced -> Paid
    { id: 'q1', quoteNumber: 'DEV-00101', clientId: 'c1', vehicleId: 'v1', date: TWO_MONTHS_AGO.toISOString(), validityDuration: 30, taxRate: 20, status: 'approved', statusHistory: [{status: 'draft', date: TWO_MONTHS_AGO.toISOString()}, {status: 'sent', date: TWO_MONTHS_AGO.toISOString()}, {status: 'approved', date: addDays(TWO_MONTHS_AGO, 2).toISOString()}], isConvertedToRepairOrder: true, laborItems: seedInterventionTemplates.find(t=>t.id==='tpl-3')!.laborItems.map(li => ({...li, id: crypto.randomUUID()})) },
    // Approved -> Invoiced -> Draft
    { id: 'q2', quoteNumber: 'DEV-00102', clientId: 'c2', vehicleId: 'v3', date: LAST_MONTH.toISOString(), validityDuration: 30, taxRate: 20, status: 'approved', statusHistory: [{status: 'draft', date: LAST_MONTH.toISOString()}, {status: 'sent', date: addDays(LAST_MONTH,1).toISOString()}, {status: 'approved', date: addDays(LAST_MONTH, 5).toISOString()}], isConvertedToRepairOrder: true, laborItems: seedInterventionTemplates.find(t=>t.id==='tpl-5')!.laborItems.map(li => ({...li, id: crypto.randomUUID()})) },
    // Approved -> In Progress
    { id: 'q3', quoteNumber: 'DEV-00103', clientId: 'c3', vehicleId: 'v4', date: addDays(LAST_WEEK, -7).toISOString(), validityDuration: 30, taxRate: 20, status: 'approved', statusHistory: [{status: 'draft', date: addDays(LAST_WEEK, -7).toISOString()}, {status: 'sent', date: addDays(LAST_WEEK, -7).toISOString()}, {status: 'approved', date: addDays(LAST_WEEK, -5).toISOString()}], isConvertedToRepairOrder: true, laborItems: seedInterventionTemplates.find(t=>t.id==='tpl-10')!.laborItems.map(li => ({...li, id: crypto.randomUUID()})) },
    // Approved -> waiting_for_part
    { id: 'q4', quoteNumber: 'DEV-00104', clientId: 'c4', vehicleId: 'v6', date: LAST_WEEK.toISOString(), validityDuration: 30, taxRate: 20, status: 'approved', statusHistory: [{status: 'draft', date: LAST_WEEK.toISOString()}, {status: 'sent', date: LAST_WEEK.toISOString()}, {status: 'approved', date: YESTERDAY.toISOString()}], isConvertedToRepairOrder: true, laborItems: seedInterventionTemplates.find(t=>t.id==='tpl-9')!.laborItems.map(li => ({...li, id: crypto.randomUUID()})) },
    // Approved -> not converted yet
    { id: 'q5', quoteNumber: 'DEV-00105', clientId: 'c5', vehicleId: 'v7', date: YESTERDAY.toISOString(), validityDuration: 30, taxRate: 20, status: 'approved', statusHistory: [{status: 'draft', date: YESTERDAY.toISOString()}, {status: 'sent', date: YESTERDAY.toISOString()}, {status: 'approved', date: TODAY.toISOString()}], isConvertedToRepairOrder: false, laborItems: seedInterventionTemplates.find(t=>t.id==='tpl-2')!.laborItems.map(li => ({...li, id: crypto.randomUUID()})) },
    { id: 'q6', quoteNumber: 'DEV-00106', clientId: 'c6', vehicleId: 'v10', date: LAST_WEEK.toISOString(), validityDuration: 30, taxRate: 20, status: 'approved', statusHistory: [{status: 'draft', date: LAST_WEEK.toISOString()}, {status: 'sent', date: LAST_WEEK.toISOString()}, {status: 'approved', date: addDays(LAST_WEEK, 2).toISOString()}], isConvertedToRepairOrder: false, laborItems: seedInterventionTemplates.find(t=>t.id==='tpl-7')!.laborItems.map(li => ({...li, id: crypto.randomUUID()})) },
    { id: 'q7', quoteNumber: 'DEV-00107', clientId: 'c7', vehicleId: 'v11', date: TODAY.toISOString(), validityDuration: 30, taxRate: 20, status: 'approved', statusHistory: [{status: 'draft', date: TODAY.toISOString()}, {status: 'sent', date: TODAY.toISOString()}, {status: 'approved', date: TODAY.toISOString()}], isConvertedToRepairOrder: false, laborItems: seedInterventionTemplates.find(t=>t.id==='tpl-13')!.laborItems.map(li => ({...li, id: crypto.randomUUID()})) },
    // Sent
    { id: 'q8', quoteNumber: 'DEV-00108', clientId: 'c8', vehicleId: 'v13', date: LAST_WEEK.toISOString(), validityDuration: 30, taxRate: 20, status: 'sent', statusHistory: [{status: 'draft', date: LAST_WEEK.toISOString()}, {status: 'sent', date: LAST_WEEK.toISOString()}], laborItems: seedInterventionTemplates.find(t=>t.id==='tpl-4')!.laborItems.map(li => ({...li, id: crypto.randomUUID()})) },
    { id: 'q9', quoteNumber: 'DEV-00109', clientId: 'c9', vehicleId: 'v14', date: YESTERDAY.toISOString(), validityDuration: 30, taxRate: 20, status: 'sent', statusHistory: [{status: 'draft', date: YESTERDAY.toISOString()}, {status: 'sent', date: YESTERDAY.toISOString()}], laborItems: seedInterventionTemplates.find(t=>t.id==='tpl-14')!.laborItems.map(li => ({...li, id: crypto.randomUUID()})) },
    { id: 'q10', quoteNumber: 'DEV-00110', clientId: 'c10', vehicleId: 'v18', date: TODAY.toISOString(), validityDuration: 30, taxRate: 20, status: 'sent', statusHistory: [{status: 'draft', date: TODAY.toISOString()}, {status: 'sent', date: TODAY.toISOString()}], laborItems: seedInterventionTemplates.find(t=>t.id==='tpl-15')!.laborItems.map(li => ({...li, id: crypto.randomUUID()})) },
    { id: 'q11', quoteNumber: 'DEV-00111', clientId: 'c1', vehicleId: 'v2', date: TODAY.toISOString(), validityDuration: 30, taxRate: 20, status: 'sent', statusHistory: [{status: 'draft', date: TODAY.toISOString()}, {status: 'sent', date: TODAY.toISOString()}], laborItems: seedInterventionTemplates.find(t=>t.id==='tpl-11')!.laborItems.map(li => ({...li, id: crypto.randomUUID()})) },
    { id: 'q12', quoteNumber: 'DEV-00112', clientId: 'c3', vehicleId: 'v5', date: addDays(TODAY, -2).toISOString(), validityDuration: 30, taxRate: 20, status: 'sent', statusHistory: [{status: 'draft', date: addDays(TODAY, -2).toISOString()}, {status: 'sent', date: addDays(TODAY, -2).toISOString()}], laborItems: seedInterventionTemplates.find(t=>t.id==='tpl-12')!.laborItems.map(li => ({...li, id: crypto.randomUUID()})) },
    // Draft
    { id: 'q13', quoteNumber: 'DEV-00113', clientId: 'c5', vehicleId: 'v8', date: TODAY.toISOString(), validityDuration: 30, taxRate: 20, status: 'draft', statusHistory: [{status: 'draft', date: TODAY.toISOString()}], laborItems: seedInterventionTemplates.find(t=>t.id==='tpl-16')!.laborItems.map(li => ({...li, id: crypto.randomUUID()})) },
    { id: 'q14', quoteNumber: 'DEV-00114', clientId: 'c7', vehicleId: 'v12', date: TODAY.toISOString(), validityDuration: 30, taxRate: 20, status: 'draft', statusHistory: [{status: 'draft', date: TODAY.toISOString()}], laborItems: seedInterventionTemplates.find(t=>t.id==='tpl-17')!.laborItems.map(li => ({...li, id: crypto.randomUUID()})) },
    { id: 'q15', quoteNumber: 'DEV-00115', clientId: 'c9', vehicleId: 'v15', date: YESTERDAY.toISOString(), validityDuration: 30, taxRate: 20, status: 'draft', statusHistory: [{status: 'draft', date: YESTERDAY.toISOString()}], laborItems: seedInterventionTemplates.find(t=>t.id==='tpl-18')!.laborItems.map(li => ({...li, id: crypto.randomUUID()})) },
    { id: 'q16', quoteNumber: 'DEV-00116', clientId: 'c9', vehicleId: 'v16', date: TODAY.toISOString(), validityDuration: 30, taxRate: 20, status: 'draft', statusHistory: [{status: 'draft', date: TODAY.toISOString()}], laborItems: seedInterventionTemplates.find(t=>t.id==='tpl-19')!.laborItems.map(li => ({...li, id: crypto.randomUUID()})) },
    { id: 'q17', quoteNumber: 'DEV-00117', clientId: 'c9', vehicleId: 'v17', date: TODAY.toISOString(), validityDuration: 30, taxRate: 20, status: 'draft', statusHistory: [{status: 'draft', date: TODAY.toISOString()}], laborItems: seedInterventionTemplates.find(t=>t.id==='tpl-20')!.laborItems.map(li => ({...li, id: crypto.randomUUID()})) },
    // Rejected
    { id: 'q18', quoteNumber: 'DEV-00118', clientId: 'c1', vehicleId: 'v2', date: LAST_MONTH.toISOString(), validityDuration: 30, taxRate: 20, status: 'rejected', statusHistory: [{status: 'draft', date: LAST_MONTH.toISOString()}, {status: 'sent', date: addDays(LAST_MONTH, 1).toISOString()}, {status: 'rejected', date: addDays(LAST_MONTH, 4).toISOString()}], laborItems: seedInterventionTemplates.find(t=>t.id==='tpl-8')!.laborItems.map(li => ({...li, id: crypto.randomUUID()})) },
    { id: 'q19', quoteNumber: 'DEV-00119', clientId: 'c6', vehicleId: 'v10', date: addDays(LAST_WEEK, -10).toISOString(), validityDuration: 30, taxRate: 20, status: 'rejected', statusHistory: [{status: 'draft', date: addDays(LAST_WEEK, -10).toISOString()}, {status: 'sent', date: addDays(LAST_WEEK, -9).toISOString()}, {status: 'rejected', date: addDays(LAST_WEEK, -5).toISOString()}], laborItems: [{ id: 'li-1', description: "Trop cher", hours: 0, rate: 0, partItems:[]}] },
    { id: 'q20', quoteNumber: 'DEV-00120', clientId: 'c8', vehicleId: 'v13', date: YESTERDAY.toISOString(), validityDuration: 30, taxRate: 20, status: 'rejected', statusHistory: [{status: 'draft', date: YESTERDAY.toISOString()}, {status: 'sent', date: YESTERDAY.toISOString()}, {status: 'rejected', date: TODAY.toISOString()}], laborItems: seedInterventionTemplates.find(t=>t.id==='tpl-6')!.laborItems.map(li => ({...li, id: crypto.randomUUID()})) },
];

// --- APPOINTMENTS, REPAIR ORDERS, INVOICES, TRANSACTIONS (Derived from Quotes) ---
export const seedAppointments: Appointment[] = [];
export const seedRepairOrders: RepairOrder[] = [];
export const seedInvoices: Invoice[] = [];
export const seedFinancialTransactions: FinancialTransaction[] = [];
export const seedPurchaseOrders: PurchaseOrder[] = [
    { id: 'po1', orderNumber: 'CMD-00201', supplier: SUPPLIERS[2], date: addDays(TODAY, -20).toISOString(), expectedDeliveryDate: addDays(TODAY, -12).toISOString(), status: 'received', items: [{id: 'poi1', partId: 'part-8', quantity: 5, unitPrice: 120.00}], isPaid: true, paymentDate: addDays(TODAY, -10).toISOString()},
    { id: 'po2', orderNumber: 'CMD-00202', supplier: SUPPLIERS[1], date: addDays(TODAY, -5).toISOString(), expectedDeliveryDate: addDays(TODAY, 2).toISOString(), status: 'ordered', items: [{id: 'poi2', partId: 'part-6', quantity: 10, unitPrice: 15.00}], isPaid: false },
    { id: 'po3', orderNumber: 'CMD-00203', supplier: SUPPLIERS[0], date: addDays(TODAY, -40).toISOString(), expectedDeliveryDate: addDays(TODAY, -30).toISOString(), status: 'received', items: [{id: 'poi3', partId: 'part-10', quantity: 8, unitPrice: 90.00}], isPaid: true, paymentDate: addDays(TODAY, -25).toISOString()},
    { id: 'po4', orderNumber: 'CMD-00204', supplier: SUPPLIERS[4], date: addDays(TODAY, -65).toISOString(), expectedDeliveryDate: addDays(TODAY, -55).toISOString(), status: 'received', items: [{id: 'poi4', partId: 'part-11', quantity: 10, unitPrice: 75.00}], isPaid: true, paymentDate: addDays(TODAY, -50).toISOString()},
    { id: 'po5', orderNumber: 'CMD-00205', supplier: SUPPLIERS[3], date: YESTERDAY.toISOString(), expectedDeliveryDate: addDays(TODAY, 7).toISOString(), status: 'draft', items: [{id: 'poi5', partId: 'part-9', quantity: 2, unitPrice: 250.00}], isPaid: false },
];

// --- GENERATE DERIVED DATA ---
let roCount = 0;
let invCount = 1;
seedQuotes.filter(q => q.isConvertedToRepairOrder).forEach(q => {
    roCount++;
    const appointmentDate = addDays(new Date(q.statusHistory.find(h => h.status === 'approved')!.date), 2);
    const appointment: Appointment = { id: `appt-${roCount}`, title: `Reparation`, start: appointmentDate.toISOString(), end: addDays(appointmentDate, 0.2).toISOString(), quoteId: q.id, clientId: q.clientId, vehicleId: q.vehicleId };
    seedAppointments.push(appointment);
    
    let status: RepairOrder['status'] = 'scheduled';
    if(q.id === 'q1') status = 'invoiced';
    if(q.id === 'q2') status = 'invoiced';
    if(q.id === 'q3') status = 'in_progress';
    if(q.id === 'q4') status = 'waiting_for_part';

    const repairOrder: RepairOrder = { id: `ro-${roCount}`, quote: q, status, technicianId: seedTechnicians[roCount % 3].id, mileage: 50000 + (roCount * 5000) };
    seedRepairOrders.push(repairOrder);

    if (status === 'invoiced') {
        const invoiceDate = addDays(appointmentDate, 1);
        let invoiceStatus: Invoice['status'] = 'draft';
        let paymentDetails: Invoice['paymentDetails'] | undefined = undefined;
        if(q.id === 'q1') {
            invoiceStatus = 'paid';
            paymentDetails = { date: addDays(invoiceDate, 5).toISOString(), method: 'card'};
        }
        
        const invoice: Invoice = { id: `inv-${invCount}`, invoiceNumber: `FAC-2024-${String(invCount).padStart(4,'0')}`, quote: q, date: invoiceDate.toISOString(), dueDate: addDays(invoiceDate, 30).toISOString(), status: invoiceStatus, paymentDetails };
        seedInvoices.push(invoice);
        
        // Add to service history
        const client = seedClients.find(c => c.id === q.clientId);
        const vehicle = client?.vehicles.find(v => v.id === q.vehicleId);
        if(client && vehicle) {
            vehicle.serviceHistory.push({
                id: `hist-ro-${roCount}`,
                date: invoiceDate.toISOString(),
                mileage: repairOrder.mileage!,
                description: q.laborItems.map(li => li.description).join(', '),
                referenceId: repairOrder.id
            });
        }

        invCount++;
    }
});

// Create more invoices for the list
for (let i = 0; i < 18; i++) {
    const client = seedClients[i % seedClients.length];
    const vehicle = client.vehicles[0];
    const template = seedInterventionTemplates[i % seedInterventionTemplates.length];
    const date = addDays(TODAY, -30 - i * 15);
    const isPaid = i % 3 !== 0;

    const quote: Quote = {
        id: `q-inv-${i}`, quoteNumber: `DEV-000${i}`, clientId: client.id, vehicleId: vehicle.id, date: date.toISOString(), validityDuration: 30, taxRate: 20, status: 'approved', isConvertedToRepairOrder: true, statusHistory: [], laborItems: template.laborItems.map(li => ({...li, id: crypto.randomUUID()}))
    };
    
    const invoice: Invoice = {
        id: `inv-${invCount}`,
        invoiceNumber: `FAC-2024-${String(invCount).padStart(4,'0')}`,
        quote,
        date: addDays(date, 7).toISOString(),
        dueDate: addDays(date, 37).toISOString(),
        status: isPaid ? 'paid' : 'draft',
        paymentDetails: isPaid ? { date: addDays(date, 10).toISOString(), method: i % 2 === 0 ? 'card' : 'transfer' } : undefined
    };
    seedInvoices.push(invoice);
    invCount++;
}

// Populate Financial Transactions from all paid invoices and POs
seedInvoices.filter(inv => inv.status === 'paid').forEach(inv => {
    const total = inv.quote.laborItems.reduce((acc, l) => acc + (l.hours * l.rate) + l.partItems.reduce((pAcc, p) => pAcc + (p.quantity * p.unitPrice), 0), 0) * (1 + inv.quote.taxRate/100);
    seedFinancialTransactions.push({ id: `ft-inv-${inv.id}`, date: inv.paymentDetails!.date, type: 'revenue', amount: total, description: `Facture ${inv.invoiceNumber}`, referenceId: inv.id });
});

seedPurchaseOrders.filter(po => po.isPaid).forEach(po => {
    const total = po.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
    seedFinancialTransactions.push({ id: `ft-po-${po.id}`, date: po.paymentDate!, type: 'expense', amount: -total, description: `Commande ${po.orderNumber}`, referenceId: po.id });
});
