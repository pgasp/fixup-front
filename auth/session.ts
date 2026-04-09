import { normalizeUserRoles, type UserRole } from './roles';

export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
  roles: UserRole[];
}

export interface AuthSession {
  token: string;
  user: AuthUser;
}

export const AUTH_STORAGE_KEY = 'fixup_auth';

/** Compat : anciennes sessions avec un seul `role`. */
export const parseAuthUser = (raw: unknown): AuthUser => {
  const o = raw as Partial<AuthUser> & { role?: UserRole };
  const roles = normalizeUserRoles(o.roles ?? (o.role != null ? [o.role] : []));
  if (!o.id || typeof o.email !== 'string' || typeof o.displayName !== 'string' || roles.length === 0) {
    throw new Error('Invalid auth user payload');
  }
  return { id: o.id, email: o.email, displayName: o.displayName, roles };
};

/** Session utilisable par l’UI : token + user valide. Sinon null (ex. token seul en localStorage → évite crash au rendu). */
export const normalizeAuthSession = (session: AuthSession | null): AuthSession | null => {
  if (!session?.token) {
    return null;
  }
  if (!session.user) {
    return null;
  }
  try {
    return { ...session, user: parseAuthUser(session.user) };
  } catch {
    return null;
  }
};
