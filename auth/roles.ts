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

export const roleLabelsFr: Record<UserRole, string> = {
  administrator: 'Administrateur',
  mechanic: 'Mécanicien',
  administrative: 'Administratif',
  supervisor: 'Superviseur',
  accountant: 'Comptable',
};
