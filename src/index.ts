import 'dotenv/config';
import '@/types/hono.ts';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { Hono } from 'hono';
import { config } from '@/config/index.ts';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import { serve } from '@hono/node-server';
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
app.get('/', c => {
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

// 404 handler (must be last)
app.notFound(notFoundHandler);

// Start server
serve(
  {
    fetch: app.fetch,
    port: config.port,
  },
  info => {
    // eslint-disable-next-line no-console
    console.log(
      `🚀 Server is running on http://localhost:${info.port}\n📊 Health check: http://localhost:${info.port}/\n🔗 API Base: http://localhost:${info.port}/api`
    );
  }
);
