import type { UserRole } from '../../auth/roles';

export interface AuthUserPublic {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
}

export interface StoredUser extends AuthUserPublic {
  passwordHash: string;
}
