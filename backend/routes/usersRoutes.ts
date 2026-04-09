import { Router } from 'express';
import {
  createUser,
  deleteUser,
  listUsers,
  setUserPassword,
  updateUser,
} from '../controllers/usersController';
import { requireBody } from '../middleware/validate';
import type { UserStore } from '../auth/userStore';

export const createUsersRouter = (userStore: UserStore): Router => {
  const router = Router();
  router.get('/', listUsers(userStore));
  router.post('/', requireBody, createUser(userStore));
  router.put('/:userId', requireBody, updateUser(userStore));
  router.delete('/:userId', deleteUser(userStore));
  router.put('/:userId/password', requireBody, setUserPassword(userStore));
  return router;
};
