import { Router } from 'express';
import { login, me } from '../controllers/authController';
import { requireBody } from '../middleware/validate';
import type { RequestHandler } from 'express';
import { UserStore } from '../auth/userStore';

export const createAuthRouter = (userStore: UserStore, requireAuth: RequestHandler): Router => {
  const router = Router();
  router.post('/login', requireBody, login(userStore));
  router.get('/me', requireAuth, me);
  return router;
};
