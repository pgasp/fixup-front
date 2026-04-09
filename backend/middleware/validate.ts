import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../errors';

export const requireBody = (req: Request, _res: Response, next: NextFunction): void => {
  if (!req.body || typeof req.body !== 'object') {
    next(new HttpError(400, 'Request body is required'));
    return;
  }
  next();
};
