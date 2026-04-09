import { Router } from 'express';
import { listTechnicianRoleAppUsers, login, me } from '../controllers/authController';
import { requireBody } from '../middleware/validate';
import { requireSection } from '../middleware/requireSection';
import type { RequestHandler } from 'express';
import { UserStore } from '../auth/userStore';

export const createAuthRouter = (userStore: UserStore, requireAuth: RequestHandler): Router => {
  const router = Router();
  router.post('/login', requireBody, login(userStore));
  router.get('/me', requireAuth, me);
  router.get(
    '/technician-app-users',
    requireAuth,
    requireSection('technicians'),
    listTechnicianRoleAppUsers(userStore),
  );
  return router;
};
