export const USER_ROLES = [
  'administrator',
  'mechanic',
  'administrative',
  'supervisor',
  'accountant',
] as const;

export type UserRole = (typeof USER_ROLES)[number];

export const isUserRole = (value: string): value is UserRole =>
  (USER_ROLES as readonly string[]).includes(value);

/** Déduplique, valide et trie les rôles (au moins un requis côté appelant). */
export const normalizeUserRoles = (input: unknown): UserRole[] => {
  if (!Array.isArray(input)) {
    return [];
  }
  const seen = new Set<UserRole>();
  for (const item of input) {
    if (typeof item === 'string' && isUserRole(item)) {
      seen.add(item);
    }
  }
  return USER_ROLES.filter((r) => seen.has(r));
};

export const roleLabelsFr: Record<UserRole, string> = {
  administrator: 'Administrateur',
  mechanic: 'Technicien',
  administrative: 'Administratif',
  supervisor: 'Superviseur',
  accountant: 'Comptable',
};

export const formatRolesLabelFr = (roles: readonly UserRole[]): string =>
  roles.map((r) => roleLabelsFr[r]).join(', ');

/** Aide courte pour l’attribution des rôles (connexion application) */
export const roleDescriptionsFr: Record<UserRole, string> = {
  administrator: 'Tout le périmètre, y compris la gestion des comptes.',
  mechanic:
    'Rôle atelier pour les comptes de connexion. Une fiche technicien peut être liée à ce compte sous Gestion → Fiches techniciens.',
  administrative: 'Accueil, devis, facturation et commandes côté bureau.',
  supervisor: 'Pilotage atelier et paramètres garage.',
  accountant: 'Facturation, achats et rapports financiers.',
};
