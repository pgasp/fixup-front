import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../errors';
import { verifyPassword } from '../auth/password';
import { signJwt } from '../auth/jwt';
import { UserStore } from '../auth/userStore';

export const login = (userStore: UserStore) => (req: Request, res: Response, next: NextFunction): void => {
  try {
    const email = req.body?.email as string | undefined;
    const password = req.body?.password as string | undefined;
    if (!email || !password) {
      throw new HttpError(400, 'email and password are required');
    }
    const user = userStore.findByEmail(email);
    if (!user || !verifyPassword(password, user.passwordHash)) {
      throw new HttpError(401, 'Invalid credentials');
    }
    const publicUser = userStore.toPublic(user);
    const token = signJwt({
      sub: user.id,
      email: user.email,
      displayName: user.displayName,
      roles: user.roles,
    });
    res.json({ token, user: publicUser });
  } catch (error) {
    next(error);
  }
};

export const me = (_req: Request, res: Response): void => {
  res.json({ user: _req.authUser });
};

/** Comptes avec le rôle technicien (clé `mechanic`), pour liaison avec les fiches atelier. */
export const listTechnicianRoleAppUsers = (userStore: UserStore) => (_req: Request, res: Response): void => {
  const list = userStore.listPublic().filter((u) => u.roles.includes('mechanic'));
  res.json(list);
};
