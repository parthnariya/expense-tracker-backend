import 'dotenv/config';
import '@/types/hono.ts';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { errorHandler } from './middleware/errorHandler.js';
import { handle } from '@hono/node-server/vercel';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import spaces from '@/routes/spaces.ts';

const app = new Hono();

// Global middleware
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

// Error handling middleware
app.use('*', errorHandler);

// Health check endpoint
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

// API routes
app.route('/api/spaces', spaces);

const handler = handle(app);

export const GET = handler;
export const POST = handler;
export const PATCH = handler;
export const PUT = handler;
export const OPTIONS = handler;
export default handle;
