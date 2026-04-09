import express, { Express } from 'express';
import { createBackendContext } from './context';
import { createRequireAuth } from './middleware/auth';
import { requireSection } from './middleware/requireSection';
import { createClientsRouter } from './routes/clientsRoutes';
import { createInvoicesRouter } from './routes/invoicesRoutes';
import { createQuotesRouter } from './routes/quotesRoutes';
import { createRepairOrdersRouter } from './routes/repairOrdersRoutes';
import { createAuthRouter } from './routes/authRoutes';
import { createUsersRouter } from './routes/usersRoutes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { requestMeta } from './middleware/requestMeta';

export type CreateAppOptions = {
  /** When true, omit notFound/error handlers so Vite or static middleware can run first (see server.ts). */
  skipNotFound?: boolean;
};

export const createApp = (options?: CreateAppOptions): Express => {
  const app = express();
  const startedAt = Date.now();
  const { store, userStore } = createBackendContext();
  const requireAuth = createRequireAuth(userStore);

  app.use(express.json({ limit: '2mb' }));
  app.use(requestMeta);

  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      version: '1.0.0',
      uptimeMs: Date.now() - startedAt,
    });
  });

  app.use('/api/v1/auth', createAuthRouter(userStore, requireAuth));

  app.use('/api/v1/users', requireAuth, requireSection('users'), createUsersRouter(userStore));

  app.use('/api/v1/clients', requireAuth, requireSection('clients'), createClientsRouter(store));
  app.use('/api/v1/quotes', requireAuth, requireSection('quotes'), createQuotesRouter(store));
  app.use('/api/v1/repair-orders', requireAuth, requireSection('repair_orders'), createRepairOrdersRouter(store));
  app.use('/api/v1/invoices', requireAuth, requireSection('invoices'), createInvoicesRouter(store));

  if (!options?.skipNotFound) {
    app.use(notFoundHandler);
    app.use(errorHandler);
  }

  return app;
};
