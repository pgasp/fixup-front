import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../errors';

export const notFoundHandler = (_req: Request, res: Response): void => {
  res.status(404).json({ error: 'Not found' });
};

export const errorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (error instanceof HttpError) {
    res.status(error.statusCode).json({ error: error.message });
    return;
  }

  res.status(500).json({ error: 'Internal server error' });
};
