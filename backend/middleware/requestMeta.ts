import { NextFunction, Request, Response } from 'express';

export const requestMeta = (req: Request, res: Response, next: NextFunction): void => {
  const requestId = req.header('x-request-id') ?? crypto.randomUUID();
  res.setHeader('x-request-id', requestId);
  res.setHeader('access-control-allow-origin', '*');
  res.setHeader('access-control-allow-headers', 'Content-Type, x-request-id');
  res.setHeader('access-control-allow-methods', 'GET,POST,PUT,DELETE,OPTIONS');

  if (req.method === 'OPTIONS') {
    res.status(204).send();
    return;
  }

  next();
};
