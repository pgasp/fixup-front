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

export const canAccessSection = (role: UserRole, section: AppSection): boolean =>
  allowedSectionsByRole[role].includes(section);

export const getDefaultSectionForRole = (role: UserRole): AppSection => {
  const allowed = allowedSectionsByRole[role];
  return allowed[0] ?? 'reports';
};

export const filterSidebarGroups = <
  G extends { title: string; items: Array<{ view: AppSection }> },
>(
  groups: G[],
  role: UserRole,
): G[] => {
  return groups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => canAccessSection(role, item.view)),
    }))
    .filter((group) => group.items.length > 0) as G[];
};
