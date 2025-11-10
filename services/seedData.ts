import { Client, Part, Technician, InterventionTemplate, PurchaseOrder, Quote, Appointment, RepairOrder, Invoice, FinancialTransaction } from '../types';

// --- IDs for linking data ---
const C_DUPONT_ID = 'client-1';
const C_CURIE_ID = 'client-2';
const C_MARTIN_ID = 'client-3';
const C_DUBOIS_ID = 'client-4';

const V_CLIO_ID = 'v-1';
const V_308_ID = 'v-2';
const V_C4_ID = 'v-3';
const V_GOLF_ID = 'v-4';
const V_YARIS_ID = 'v-5';

const P_FILTRE_HUILE_ID = 'part-1';
const P_PLAQUETTES_AV_ID = 'part-2';
const P_HUILE_5W30_ID = 'part-3';
const P_COURROIE_DIST_ID = 'part-4';
const P_BOUGIE_ID = 'part-5';
const P_FILTRE_AIR_ID = 'part-6';
const P_DISQUES_AV_ID = 'part-7';
const P_AMORTISSEURS_AV_ID = 'part-8';
const P_KIT_EMBRAYAGE_ID = 'part-9';
const P_PNEU_MICHELIN_ID = 'part-10';
const P_BATTERIE_VARTA_ID = 'part-11';
const P_FILTRE_HABITACLE_ID = 'part-12';

const T_LAVOINE_ID = 'tech-1';
const T_MARCEAU_ID = 'tech-2';
const T_CLERC_ID = 'tech-3';

const Q_DUPONT_CLIO_ID = 'quote-1';
const Q_CURIE_C4_ID = 'quote-2';
const Q_MARTIN_GOLF_ID = 'quote-3';
const Q_DUBOIS_YARIS_ID = 'quote-4';
const Q_DUPONT_308_ID = 'quote-5';
const Q_CURIE_C4_REPAIR_ID = 'quote-6';

const APPT_DUPONT_CLIO_ID = 'appt-1';
const APPT_DUPONT_308_ID = 'appt-2';
const APPT_CURIE_C4_ID = 'appt-3';

const RO_DUPONT_CLIO_ID = 'ro-1';
const RO_CURIE_C4_ID = 'ro-2';

const INV_CURIE_C4_ID = 'inv-1';


// --- SEED DATA ---

export const seedClients: Client[] = [
  {
    id: C_DUPONT_ID,
    name: 'Jean Dupont',
    email: 'jean.dupont@email.com',
    phone: '0612345678',
    address: '12 Rue de la Paix',
    postalCode: '75001',
    city: 'Paris',
    vehicles: [
      { id: V_CLIO_ID, licensePlate: 'AA-123-BB', make: 'Renault', model: 'Clio' },
      { id: V_308_ID, licensePlate: 'CC-456-DD', make: 'Peugeot', model: '308' },
    ],
  },
  {
    id: C_CURIE_ID,
    name: 'Marie Curie',
    email: 'marie.curie@email.com',
    phone: '0687654321',
    address: '45 Avenue des Champs-Élysées',
    postalCode: '75008',
    city: 'Paris',
    vehicles: [{ id: V_C4_ID, licensePlate: 'EE-789-FF', make: 'Citroën', model: 'C4' }],
  },
  {
    id: C_MARTIN_ID,
    name: 'Lucas Martin',
    email: 'lucas.martin@email.com',
    phone: '0611223344',
    address: '10 Rue du Faubourg Saint-Honoré',
    postalCode: '75008',
    city: 'Paris',
    vehicles: [{ id: V_GOLF_ID, licensePlate: 'GG-111-HH', make: 'Volkswagen', model: 'Golf' }],
  },
  {
    id: C_DUBOIS_ID,
    name: 'Chloé Dubois',
    email: 'chloe.dubois@email.com',
    phone: '0655667788',
    address: '25 Boulevard Haussmann',
    postalCode: '75009',
    city: 'Paris',
    vehicles: [{ id: V_YARIS_ID, licensePlate: 'II-222-JJ', make: 'Toyota', model: 'Yaris' }],
  },
];

export const seedParts: Part[] = [
    { id: P_FILTRE_HUILE_ID, name: 'Filtre à huile', reference: 'F-HUI-001', supplier: 'Bosch', stock: 50, purchasePrice: 8.50, pricingMethod: 'markup', markupPercentage: 50 },
    { id: P_PLAQUETTES_AV_ID, name: 'Plaquettes de frein (AV)', reference: 'P-FRE-002', supplier: 'Brembo', stock: 25, purchasePrice: 35.00, pricingMethod: 'fixed', sellingPrice: 60.00 },
    { id: P_HUILE_5W30_ID, name: 'Huile Moteur 5W30 (5L)', reference: 'H-MOT-003', supplier: 'Total', stock: 30, purchasePrice: 25.00, pricingMethod: 'markup', markupPercentage: 60 },
    { id: P_COURROIE_DIST_ID, name: 'Courroie de distribution', reference: 'C-DIS-004', supplier: 'Gates', stock: 15, purchasePrice: 45.00, pricingMethod: 'fixed', sellingPrice: 85.00 },
    { id: P_BOUGIE_ID, name: 'Bougie d\'allumage', reference: 'B-ALL-005', supplier: 'NGK', stock: 100, purchasePrice: 5.00, pricingMethod: 'markup', markupPercentage: 100 },
    { id: P_FILTRE_AIR_ID, name: 'Filtre à air', reference: 'F-AIR-006', supplier: 'Bosch', stock: 2, purchasePrice: 15.00, pricingMethod: 'markup', markupPercentage: 50 },
    { id: P_DISQUES_AV_ID, name: 'Disques de frein (AV)', reference: 'D-FRE-007', supplier: 'Brembo', stock: 10, purchasePrice: 80.00, pricingMethod: 'fixed', sellingPrice: 150.00 },
    { id: P_AMORTISSEURS_AV_ID, name: 'Amortisseurs (AV)', reference: 'A-AMM-008', supplier: 'Monroe', stock: 0, purchasePrice: 120.00, pricingMethod: 'markup', markupPercentage: 50 },
    { id: P_KIT_EMBRAYAGE_ID, name: 'Kit d\'embrayage', reference: 'K-EMB-009', supplier: 'Valeo', stock: 5, purchasePrice: 250.00, pricingMethod: 'markup', markupPercentage: 40 },
    { id: P_PNEU_MICHELIN_ID, name: 'Pneu Michelin Primacy 4', reference: 'P-PNE-010', supplier: 'Michelin', stock: 12, purchasePrice: 90.00, pricingMethod: 'fixed', sellingPrice: 125.00 },
    { id: P_BATTERIE_VARTA_ID, name: 'Batterie Varta Blue Dynamic', reference: 'B-BAT-011', supplier: 'Varta', stock: 8, purchasePrice: 75.00, pricingMethod: 'markup', markupPercentage: 40 },
    { id: P_FILTRE_HABITACLE_ID, name: 'Filtre d\'habitacle', reference: 'F-HAB-012', supplier: 'Bosch', stock: 40, purchasePrice: 12.00, pricingMethod: 'markup', markupPercentage: 60 },
];

export const seedTechnicians: Technician[] = [
    { id: T_LAVOINE_ID, name: 'Marc Lavoine', specialty: 'Moteur', email: 'marc@garage.com', phone: '0711223344', hireDate: '2022-01-15T00:00:00.000Z' },
    { id: T_MARCEAU_ID, name: 'Sophie Marceau', specialty: 'Électronique', email: 'sophie@garage.com', phone: '0755667788', hireDate: '2021-06-01T00:00:00.000Z' },
    { id: T_CLERC_ID, name: 'Julien Clerc', specialty: 'Pneumatique et Freinage', email: 'julien@garage.com', phone: '0799887766', hireDate: '2023-03-10T00:00:00.000Z' },
];

export const seedInterventionTemplates: InterventionTemplate[] = [
  {
    id: 'template-1',
    name: 'Forfait Vidange Simple',
    laborItems: [
      {
        description: "Vidange moteur et remplacement filtre à huile",
        hours: 1,
        rate: 60,
        partItems: [
          { id: 'pi-1-1', partId: P_FILTRE_HUILE_ID, description: 'Filtre à huile', quantity: 1, unitPrice: 12.75 },
          { id: 'pi-1-2', partId: P_HUILE_5W30_ID, description: 'Huile Moteur 5W30 (5L)', quantity: 1, unitPrice: 40.00 },
        ],
      },
    ],
  },
  {
    id: 'template-2',
    name: 'Remplacement Plaquettes de Frein Avant',
    laborItems: [
      {
        description: "Remplacement des plaquettes de frein avant",
        hours: 1.5,
        rate: 65,
        partItems: [
          { id: 'pi-2-1', partId: P_PLAQUETTES_AV_ID, description: 'Plaquettes de frein (AV)', quantity: 1, unitPrice: 60.00 },
        ],
      },
    ],
  },
  {
    id: 'template-3',
    name: 'Forfait Révision Complète',
    laborItems: [
      {
        description: 'Révision générale: vidange, filtres, contrôles',
        hours: 2.5,
        rate: 70,
        partItems: [
          { id: 'pi-3-1', partId: P_FILTRE_HUILE_ID, description: 'Filtre à huile', quantity: 1, unitPrice: 12.75 },
          { id: 'pi-3-2', partId: P_HUILE_5W30_ID, description: 'Huile Moteur 5W30 (5L)', quantity: 1, unitPrice: 40.00 },
          { id: 'pi-3-3', partId: P_FILTRE_AIR_ID, description: 'Filtre à air', quantity: 1, unitPrice: 22.50 },
          { id: 'pi-3-4', partId: P_FILTRE_HABITACLE_ID, description: 'Filtre d\'habitacle', quantity: 1, unitPrice: 19.20 },
        ]
      }
    ]
  }
];

export const seedQuotes: Quote[] = [
  {
    id: Q_DUPONT_CLIO_ID,
    quoteNumber: 'DEV-00001',
    clientId: C_DUPONT_ID,
    vehicleId: V_CLIO_ID,
    date: '2024-07-10T10:00:00.000Z',
    validityDuration: 30,
    taxRate: 20,
    status: 'approved',
    statusHistory: [
        { status: 'draft', date: '2024-07-10T10:00:00.000Z' },
        { status: 'sent', date: '2024-07-10T11:00:00.000Z' },
        { status: 'approved', date: '2024-07-12T15:00:00.000Z' }
    ],
    isConvertedToRepairOrder: true,
    laborItems: [
        { id: 'li-1', description: "Remplacement kit de distribution", hours: 4, rate: 75, partItems: [
            { id: 'pi-1', partId: P_COURROIE_DIST_ID, description: 'Courroie de distribution', quantity: 1, unitPrice: 85.00 }
        ]}
    ]
  },
  {
    id: Q_CURIE_C4_ID,
    quoteNumber: 'DEV-00002',
    clientId: C_CURIE_ID,
    vehicleId: V_C4_ID,
    date: '2024-07-11T14:00:00.000Z',
    validityDuration: 30,
    taxRate: 20,
    status: 'rejected',
    statusHistory: [
        { status: 'draft', date: '2024-07-11T14:00:00.000Z' },
        { status: 'sent', date: '2024-07-11T14:30:00.000Z' },
        { status: 'rejected', date: '2024-07-15T09:00:00.000Z' }
    ],
    laborItems: [
        { id: 'li-2', description: "Changement 4 pneus", hours: 1.5, rate: 60, partItems: [
            { id: 'pi-2', partId: P_PNEU_MICHELIN_ID, description: 'Pneu Michelin Primacy 4', quantity: 4, unitPrice: 125.00 }
        ]}
    ]
  },
  {
    id: Q_MARTIN_GOLF_ID,
    quoteNumber: 'DEV-00003',
    clientId: C_MARTIN_ID,
    vehicleId: V_GOLF_ID,
    date: '2024-07-20T09:00:00.000Z',
    validityDuration: 30,
    taxRate: 20,
    status: 'sent',
    statusHistory: [
        { status: 'draft', date: '2024-07-20T09:00:00.000Z' },
        { status: 'sent', date: '2024-07-20T09:15:00.000Z' }
    ],
    laborItems: [
        { id: 'li-3', description: "Remplacement disques et plaquettes AV", hours: 2, rate: 70, partItems: [
            { id: 'pi-3-1', partId: P_DISQUES_AV_ID, description: 'Disques de frein (AV)', quantity: 1, unitPrice: 150.00 },
            { id: 'pi-3-2', partId: P_PLAQUETTES_AV_ID, description: 'Plaquettes de frein (AV)', quantity: 1, unitPrice: 60.00 }
        ]}
    ]
  },
  {
    id: Q_DUBOIS_YARIS_ID,
    quoteNumber: 'DEV-00004',
    clientId: C_DUBOIS_ID,
    vehicleId: V_YARIS_ID,
    date: '2024-07-22T16:00:00.000Z',
    validityDuration: 30,
    taxRate: 20,
    status: 'draft',
    statusHistory: [
        { status: 'draft', date: '2024-07-22T16:00:00.000Z' }
    ],
    laborItems: [
        { id: 'li-4', description: "Remplacement batterie", hours: 0.5, rate: 50, partItems: [
            { id: 'pi-4', partId: P_BATTERIE_VARTA_ID, description: 'Batterie Varta Blue Dynamic', quantity: 1, unitPrice: 105.00 }
        ]}
    ]
  },
  {
    id: Q_DUPONT_308_ID,
    quoteNumber: 'DEV-00005',
    clientId: C_DUPONT_ID,
    vehicleId: V_308_ID,
    date: '2024-07-23T11:00:00.000Z',
    validityDuration: 30,
    taxRate: 20,
    status: 'approved',
    statusHistory: [
        { status: 'draft', date: '2024-07-23T11:00:00.000Z' },
        { status: 'sent', date: '2024-07-23T11:20:00.000Z' },
        { status: 'approved', date: '2024-07-24T10:00:00.000Z' }
    ],
    laborItems: [
        { id: 'li-5', description: "Forfait Vidange Simple", hours: 1, rate: 60, partItems: [
            { id: 'pi-5-1', partId: P_FILTRE_HUILE_ID, description: 'Filtre à huile', quantity: 1, unitPrice: 12.75 },
            { id: 'pi-5-2', partId: P_HUILE_5W30_ID, description: 'Huile Moteur 5W30 (5L)', quantity: 1, unitPrice: 40.00 },
        ]}
    ]
  },
  {
    id: Q_CURIE_C4_REPAIR_ID,
    quoteNumber: 'DEV-00006',
    clientId: C_CURIE_ID,
    vehicleId: V_C4_ID,
    date: '2024-06-15T09:00:00.000Z',
    validityDuration: 30,
    taxRate: 20,
    status: 'approved',
    statusHistory: [
        { status: 'draft', date: '2024-06-15T09:00:00.000Z' },
        { status: 'sent', date: '2024-06-15T09:15:00.000Z' },
        { status: 'approved', date: '2024-06-16T10:00:00.000Z' }
    ],
    isConvertedToRepairOrder: true,
    laborItems: [
        { id: 'li-6', description: "Remplacement batterie", hours: 0.5, rate: 50, partItems: [
            { id: 'pi-6', partId: P_BATTERIE_VARTA_ID, description: 'Batterie Varta Blue Dynamic', quantity: 1, unitPrice: 105.00 }
        ]}
    ]
  }
];

export const seedAppointments: Appointment[] = [
    {
        id: APPT_DUPONT_CLIO_ID,
        title: 'Réparation: Jean Dupont - Renault Clio',
        start: '2024-07-25T09:00:00.000Z',
        end: '2024-07-25T13:00:00.000Z',
        quoteId: Q_DUPONT_CLIO_ID,
        clientId: C_DUPONT_ID,
        vehicleId: V_CLIO_ID,
    },
    {
        id: APPT_DUPONT_308_ID,
        title: 'Réparation: Jean Dupont - Peugeot 308',
        start: '2024-07-29T14:00:00.000Z',
        end: '2024-07-29T15:00:00.000Z',
        quoteId: Q_DUPONT_308_ID,
        clientId: C_DUPONT_ID,
        vehicleId: V_308_ID,
    },
     {
        id: APPT_CURIE_C4_ID,
        title: 'Réparation: Marie Curie - Citroën C4',
        start: '2024-06-20T10:00:00.000Z',
        end: '2024-06-20T11:00:00.000Z',
        quoteId: Q_CURIE_C4_REPAIR_ID,
        clientId: C_CURIE_ID,
        vehicleId: V_C4_ID,
    }
];

export const seedRepairOrders: RepairOrder[] = [
    {
        id: RO_DUPONT_CLIO_ID,
        quote: seedQuotes.find(q => q.id === Q_DUPONT_CLIO_ID)!,
        status: 'in_progress',
        technicianId: T_LAVOINE_ID,
        notes: "Le client signale un bruit de claquement au démarrage. A vérifier."
    },
    {
        id: RO_CURIE_C4_ID,
        quote: seedQuotes.find(q => q.id === Q_CURIE_C4_REPAIR_ID)!,
        status: 'invoiced',
        technicianId: T_MARCEAU_ID,
        notes: "Batterie remplacée. Système de charge vérifié, OK."
    }
];

export const seedInvoices: Invoice[] = [
    {
        id: INV_CURIE_C4_ID,
        invoiceNumber: 'FAC-2024-0001',
        quote: seedQuotes.find(q => q.id === Q_CURIE_C4_REPAIR_ID)!,
        date: '2024-06-21T17:00:00.000Z',
        dueDate: '2024-07-21T17:00:00.000Z',
        status: 'paid',
        paymentDetails: {
            date: '2024-06-25T14:00:00.000Z',
            method: 'card'
        }
    }
];

export const seedPurchaseOrders: PurchaseOrder[] = [
    {
        id: 'po-1',
        orderNumber: 'CMD-00001',
        supplier: 'Bosch',
        date: '2024-07-20T00:00:00.000Z',
        expectedDeliveryDate: '2024-07-28T00:00:00.000Z',
        status: 'ordered',
        items: [
            { id: 'poi-1-1', partId: P_FILTRE_HUILE_ID, quantity: 20, unitPrice: 8.50 },
            { id: 'poi-1-2', partId: P_FILTRE_AIR_ID, quantity: 30, unitPrice: 15.00 },
        ],
        isPaid: false
    },
    {
        id: 'po-2',
        orderNumber: 'CMD-00002',
        supplier: 'Brembo',
        date: '2024-07-15T00:00:00.000Z',
        expectedDeliveryDate: '2024-07-22T00:00:00.000Z',
        status: 'received',
        items: [
             { id: 'poi-2-1', partId: P_PLAQUETTES_AV_ID, quantity: 10, unitPrice: 35.00 },
        ],
        isPaid: true,
        paymentDate: '2024-07-25T00:00:00.000Z'
    },
     {
        id: 'po-3',
        orderNumber: 'CMD-00003',
        supplier: 'Monroe',
        date: '2024-07-24T00:00:00.000Z',
        status: 'draft',
        items: [
             { id: 'poi-3-1', partId: P_AMORTISSEURS_AV_ID, quantity: 4, unitPrice: 120.00 },
        ],
        isPaid: false,
    }
];

export const seedFinancialTransactions: FinancialTransaction[] = [];

// Add transactions for paid orders/invoices
const paidPO = seedPurchaseOrders.find(po => po.isPaid);
if(paidPO) {
    const total = paidPO.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
    seedFinancialTransactions.push({
        id: 'trans-exp-1',
        date: paidPO.paymentDate!,
        type: 'expense',
        amount: -total,
        description: `Paiement commande ${paidPO.orderNumber} (${paidPO.supplier})`,
        referenceId: paidPO.id,
    });
}

const paidInvoice = seedInvoices.find(inv => inv.status === 'paid');
if (paidInvoice) {
    const quote = paidInvoice.quote;
    const subtotal = quote.laborItems.reduce((sum, labor) => sum + (labor.hours * labor.rate) + labor.partItems.reduce((pSum, p) => pSum + (p.quantity * p.unitPrice), 0), 0);
    const total = subtotal * (1 + quote.taxRate / 100);
    seedFinancialTransactions.push({
        id: 'trans-rev-1',
        date: paidInvoice.paymentDetails!.date,
        type: 'revenue',
        amount: total,
        description: `Paiement facture ${paidInvoice.invoiceNumber}`,
        referenceId: paidInvoice.id,
    });
}
