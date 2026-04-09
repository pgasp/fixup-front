import { NextFunction, Request, Response } from 'express';
import { canAccessSection } from '../../auth/appSections';
import type { AppSection } from '../../auth/appSections';
import { HttpError } from '../errors';

export const requireSection = (section: AppSection) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = req.authUser;
    if (!user) {
      next(new HttpError(401, 'Unauthorized'));
      return;
    }
    if (!canAccessSection(user.roles, section)) {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }
    next();
  };
};
