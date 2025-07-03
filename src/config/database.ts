/* eslint-disable node/no-process-env */
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

const sql = neon(process.env.DATABASE_URL!);

export const db = drizzle({ client: sql });
