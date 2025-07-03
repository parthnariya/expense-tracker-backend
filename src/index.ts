import 'dotenv/config';

import '@/types/hono.ts';
import { serve } from '@hono/node-server';

import app from '@/app';
import { config } from '@/config/index';

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
