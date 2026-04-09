import type { UserRole } from '../../auth/roles';
import { HttpError } from '../errors';
import { hashPassword } from './password';
import type { AuthUserPublic, StoredUser } from './types';

/** Comptes de développement (mot de passe = dernier champ). À remplacer en production. */
const seedUsers: Array<{
  email: string;
  displayName: string;
  role: UserRole;
  plainPassword: string;
}> = [
  { email: 'admin@fixup.local', displayName: 'Admin FixUp', role: 'administrator', plainPassword: 'admin123' },
  { email: 'mecanicien@fixup.local', displayName: 'Jean Mécano', role: 'mechanic', plainPassword: 'meca123' },
  { email: 'administratif@fixup.local', displayName: 'Marie Accueil', role: 'administrative', plainPassword: 'admin123' },
  { email: 'superviseur@fixup.local', displayName: 'Paul Chef', role: 'supervisor', plainPassword: 'super123' },
  { email: 'comptable@fixup.local', displayName: 'Sophie Compta', role: 'accountant', plainPassword: 'compta123' },
];

const buildInitialUsers = (): StoredUser[] => {
  return seedUsers.map((seed) => ({
    id: crypto.randomUUID(),
    email: seed.email.toLowerCase(),
    displayName: seed.displayName,
    role: seed.role,
    passwordHash: hashPassword(seed.plainPassword),
  }));
};

export class UserStore {
  private users: StoredUser[];

  constructor(initialUsers?: StoredUser[]) {
    this.users = initialUsers ?? buildInitialUsers();
  }

  /** Copie pour sérialisation (base locale, sauvegardes). */
  snapshotUsers(): StoredUser[] {
    return structuredClone(this.users);
  }

  findByEmail(email: string): StoredUser | undefined {
    const normalized = email.trim().toLowerCase();
    return this.users.find((user) => user.email === normalized);
  }

  findById(id: string): StoredUser | undefined {
    return this.users.find((user) => user.id === id);
  }

  toPublic(user: StoredUser): AuthUserPublic {
    const { passwordHash: _p, ...rest } = user;
    return rest;
  }

  listPublic(): AuthUserPublic[] {
    return this.users.map((user) => this.toPublic(user));
  }

  private administratorCount(): number {
    return this.users.filter((u) => u.role === 'administrator').length;
  }

  create(input: { email: string; displayName: string; role: UserRole; password: string }): AuthUserPublic {
    const email = input.email.trim().toLowerCase();
    const displayName = input.displayName.trim();
    if (!email || !displayName) {
      throw new HttpError(400, 'email and displayName are required');
    }
    if (!input.password || input.password.length < 6) {
      throw new HttpError(400, 'password must be at least 6 characters');
    }
    if (this.findByEmail(email)) {
      throw new HttpError(409, 'Email already in use');
    }
    const user: StoredUser = {
      id: crypto.randomUUID(),
      email,
      displayName,
      role: input.role,
      passwordHash: hashPassword(input.password),
    };
    this.users.push(user);
    return this.toPublic(user);
  }

  update(
    id: string,
    input: { email?: string; displayName?: string; role?: UserRole },
  ): AuthUserPublic {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) {
      throw new HttpError(404, 'User not found');
    }
    const current = this.users[index];
    let email = current.email;
    if (input.email !== undefined) {
      email = input.email.trim().toLowerCase();
      if (!email) {
        throw new HttpError(400, 'email cannot be empty');
      }
      const other = this.users.find((u) => u.email === email && u.id !== id);
      if (other) {
        throw new HttpError(409, 'Email already in use');
      }
    }
    const displayName = input.displayName !== undefined ? input.displayName.trim() : current.displayName;
    if (!displayName) {
      throw new HttpError(400, 'displayName cannot be empty');
    }
    const role = input.role !== undefined ? input.role : current.role;
    if (current.role === 'administrator' && role !== 'administrator' && this.administratorCount() <= 1) {
      throw new HttpError(403, 'Cannot demote the last administrator');
    }
    this.users[index] = {
      ...current,
      email,
      displayName,
      role,
    };
    return this.toPublic(this.users[index]);
  }

  setPassword(id: string, plainPassword: string): void {
    const user = this.findById(id);
    if (!user) {
      throw new HttpError(404, 'User not found');
    }
    if (!plainPassword || plainPassword.length < 6) {
      throw new HttpError(400, 'password must be at least 6 characters');
    }
    user.passwordHash = hashPassword(plainPassword);
  }

  remove(id: string, requesterId: string): void {
    if (id === requesterId) {
      throw new HttpError(403, 'Cannot delete your own account');
    }
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) {
      throw new HttpError(404, 'User not found');
    }
    const target = this.users[index];
    if (target.role === 'administrator' && this.administratorCount() <= 1) {
      throw new HttpError(403, 'Cannot delete the last administrator');
    }
    this.users.splice(index, 1);
  }
}
