import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';

import spaces from '@/routes/spaces';

import { errorHandler } from './middleware/errorHandler.js';

const app = new Hono();

app.use('*', logger());
app.use('*', prettyJSON());
app.use(
  '*',
  cors({
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use('*', errorHandler);

app.get('/api', c => {
  return c.json({
    success: true,
    data: {
      message: 'Expense Tracker API',
      version: '1.0.0',
      status: 'healthy',
    },
    meta: {
      timestamp: new Date().toISOString(),
      path: c.req.path,
    },
  });
});

app.route('/api/spaces', spaces);

export default app;
