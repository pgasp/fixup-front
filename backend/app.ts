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

const shouldPersistAfterRequest = (req: express.Request): boolean => {
  if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    return false;
  }
  const p = req.path ?? '';
  if (p === '/api/v1/auth/login' || p.endsWith('/auth/login')) {
    return false;
  }
  return true;
};

export const createApp = (options?: CreateAppOptions): Express => {
  const app = express();
  const startedAt = Date.now();
  const { store, userStore, persist } = createBackendContext();
  const requireAuth = createRequireAuth(userStore);

  app.use(express.json({ limit: '2mb' }));
  app.use(requestMeta);

  if (persist) {
    const flush = (): void => {
      try {
        persist();
      } catch (err) {
        console.error('FIXUP_DB_PATH: échec de la sauvegarde SQLite', err);
      }
    };
    app.use((req, res, next) => {
      if (!shouldPersistAfterRequest(req)) {
        return next();
      }
      res.on('finish', () => {
        if (res.statusCode >= 200 && res.statusCode < 400) {
          flush();
        }
      });
      next();
    });
    const onShutdown = (): void => {
      flush();
    };
    process.once('SIGINT', onShutdown);
    process.once('SIGTERM', onShutdown);
  }

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
