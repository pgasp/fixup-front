import type { UserRole } from './roles';

export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
}

export interface AuthSession {
  token: string;
  user: AuthUser;
}

export const AUTH_STORAGE_KEY = 'fixup_auth';
