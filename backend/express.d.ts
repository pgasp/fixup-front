import type { AuthUserPublic } from './auth/types';

declare global {
  namespace Express {
    interface Request {
      authUser?: AuthUserPublic;
    }
  }
}

export {};
