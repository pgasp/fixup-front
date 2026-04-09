import { NextFunction, Request, Response } from 'express';
import { isUserRole, normalizeUserRoles, type UserRole } from '../../auth/roles';
import { HttpError } from '../errors';
import { UserStore } from '../auth/userStore';
import { asRouteParam } from '../routeParams';

const parseRolesBody = (value: unknown): UserRole[] | null => {
  if (Array.isArray(value)) {
    return normalizeUserRoles(value);
  }
  if (typeof value === 'string' && isUserRole(value)) {
    return [value];
  }
  return null;
};

export const listUsers = (userStore: UserStore) => (_req: Request, res: Response): void => {
  res.json(userStore.listPublic());
};

export const createUser = (userStore: UserStore) => (req: Request, res: Response, next: NextFunction): void => {
  try {
    const body = req.body as Record<string, unknown>;
    const { email, displayName, password } = body;
    const roles = parseRolesBody(body.roles ?? body.role);
    if (typeof email !== 'string' || typeof displayName !== 'string' || typeof password !== 'string') {
      throw new HttpError(400, 'email, displayName, and password are required');
    }
    if (!roles || roles.length === 0) {
      throw new HttpError(400, 'roles: at least one valid role is required');
    }
    const user = userStore.create({
      email,
      displayName,
      roles,
      password,
    });
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

export const updateUser = (userStore: UserStore) => (req: Request, res: Response, next: NextFunction): void => {
  try {
    const body = req.body as Record<string, unknown>;
    const { email, displayName } = body;
    const updates: { email?: string; displayName?: string; roles?: UserRole[] } = {};
    if (email !== undefined) {
      if (typeof email !== 'string') {
        throw new HttpError(400, 'email must be a string');
      }
      updates.email = email;
    }
    if (displayName !== undefined) {
      if (typeof displayName !== 'string') {
        throw new HttpError(400, 'displayName must be a string');
      }
      updates.displayName = displayName;
    }
    if (body.roles !== undefined || body.role !== undefined) {
      const roles = parseRolesBody(body.roles ?? body.role);
      if (!roles || roles.length === 0) {
        throw new HttpError(400, 'roles: at least one valid role is required');
      }
      updates.roles = roles;
    }
    if (Object.keys(updates).length === 0) {
      throw new HttpError(400, 'At least one field to update is required');
    }
    const user = userStore.update(asRouteParam(req.params.userId), updates);
    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = (userStore: UserStore) => (req: Request, res: Response, next: NextFunction): void => {
  try {
    const requester = req.authUser;
    if (!requester) {
      throw new HttpError(401, 'Unauthorized');
    }
    userStore.remove(asRouteParam(req.params.userId), requester.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const setUserPassword = (userStore: UserStore) => (req: Request, res: Response, next: NextFunction): void => {
  try {
    const { password } = req.body as Record<string, unknown>;
    if (typeof password !== 'string') {
      throw new HttpError(400, 'password is required');
    }
    userStore.setPassword(asRouteParam(req.params.userId), password);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
