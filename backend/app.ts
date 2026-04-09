import express, { Express } from 'express';
import { createBackendContext } from './context';
import { createClientsRouter } from './routes/clientsRoutes';
import { createInvoicesRouter } from './routes/invoicesRoutes';
import { createQuotesRouter } from './routes/quotesRoutes';
import { createRepairOrdersRouter } from './routes/repairOrdersRoutes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { requestMeta } from './middleware/requestMeta';

export const createApp = (): Express => {
  const app = express();
  const startedAt = Date.now();
  const { store } = createBackendContext();

  app.use(express.json({ limit: '2mb' }));
  app.use(requestMeta);

  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      version: '1.0.0',
      uptimeMs: Date.now() - startedAt,
    });
  });

  app.use('/api/v1/clients', createClientsRouter(store));
  app.use('/api/v1/quotes', createQuotesRouter(store));
  app.use('/api/v1/repair-orders', createRepairOrdersRouter(store));
  app.use('/api/v1/invoices', createInvoicesRouter(store));

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
