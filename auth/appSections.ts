import type { UserRole } from './roles';

/** Sections écran = clés `activeView` dans App.tsx */
export const APP_SECTIONS = [
  'quotes',
  'clients',
  'scheduler',
  'repair_orders',
  'invoices',
  'templates',
  'technicians',
  'parts',
  'part_pricing',
  'pre_orders',
  'purchase_orders',
  'reports',
  'accounting',
  'settings',
  'users',
] as const;

export type AppSection = (typeof APP_SECTIONS)[number];

/** Titres d’écran (barre principale) — libellés en français */
export const sectionLabelsFr: Record<AppSection, string> = {
  quotes: 'Devis',
  clients: 'Clients',
  scheduler: 'Planning',
  repair_orders: 'Fiches réparation',
  invoices: 'Factures',
  templates: 'Catalogue interventions',
  technicians: 'Fiches techniciens',
  parts: 'Pièces',
  part_pricing: 'Cotations pièces',
  pre_orders: 'Pré-commandes',
  purchase_orders: 'Commandes',
  reports: 'Tableau de bord',
  accounting: 'Analyse financière',
  settings: 'Paramètres garage',
  users: 'Utilisateurs',
};

export const isAppSection = (value: string): value is AppSection =>
  (APP_SECTIONS as readonly string[]).includes(value);

/** Map URL API (/api/v1/xxx) vers AppSection */
export const apiPrefixToSection = (firstSegment: string): AppSection | null => {
  const map: Record<string, AppSection> = {
    clients: 'clients',
    quotes: 'quotes',
    'repair-orders': 'repair_orders',
    invoices: 'invoices',
  };
  return map[firstSegment] ?? null;
};

/**
 * Matrice par défaut (modifiable). L’administrateur a tout ; les autres ont un périmètre métier typique.
 */
export const allowedSectionsByRole: Record<UserRole, readonly AppSection[]> = {
  administrator: [...APP_SECTIONS],
  mechanic: [
    'repair_orders',
    'scheduler',
    'parts',
    'templates',
    'technicians',
    'reports',
  ],
  administrative: [
    'quotes',
    'clients',
    'scheduler',
    'invoices',
    'part_pricing',
    'pre_orders',
    'purchase_orders',
    'reports',
  ],
  supervisor: [
    'quotes',
    'clients',
    'scheduler',
    'repair_orders',
    'invoices',
    'templates',
    'technicians',
    'parts',
    'part_pricing',
    'pre_orders',
    'purchase_orders',
    'reports',
    'accounting',
    'settings',
  ],
  accountant: ['invoices', 'purchase_orders', 'reports', 'accounting'],
};

/** L’utilisateur a accès si au moins un de ses rôles autorise la section. */
export const canAccessSection = (roles: readonly UserRole[], section: AppSection): boolean =>
  roles.some((r) => allowedSectionsByRole[r].includes(section));

export const getDefaultSectionForRoles = (roles: readonly UserRole[]): AppSection => {
  if (roles.length === 0) {
    return 'reports';
  }
  for (const section of APP_SECTIONS) {
    if (canAccessSection(roles, section)) {
      return section;
    }
  }
  return 'reports';
};

export const filterSidebarGroups = <
  G extends { title: string; items: Array<{ view: AppSection }> },
>(
  groups: G[],
  roles: readonly UserRole[],
): G[] => {
  return groups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => canAccessSection(roles, item.view)),
    }))
    .filter((group) => group.items.length > 0) as G[];
};
