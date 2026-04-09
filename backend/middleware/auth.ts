import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../errors';
import { verifyJwt } from '../auth/jwt';
import { UserStore } from '../auth/userStore';

export const createRequireAuth = (userStore: UserStore) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
      next(new HttpError(401, 'Unauthorized'));
      return;
    }
    const token = header.slice('Bearer '.length).trim();
    if (!token) {
      next(new HttpError(401, 'Unauthorized'));
      return;
    }
    try {
      const payload = verifyJwt(token);
      const user = userStore.findById(payload.sub);
      if (!user) {
        next(new HttpError(401, 'Unauthorized'));
        return;
      }
      req.authUser = userStore.toPublic(user);
      next();
    } catch {
      next(new HttpError(401, 'Unauthorized'));
    }
  };
};
