import { Context, Next } from 'hono';
import { z } from 'zod';

export type BaseValidatedData = {
  body?: unknown;
  query?: unknown;
  params?: unknown;
};

export const validateBody = <T extends z.ZodType>(schema: T) => {
  return async (c: Context, next: Next) => {
    try {
      const body = await c.req.json();
      const validatedBody = schema.parse(body);
      c.set('validated', { ...c.get('validated'), body: validatedBody });
      await next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw error;
      }
      console.log({ error });
      throw new Error('Invalid JSON body');
    }
  };
};

export const validateQuery = <T extends z.ZodType>(schema: T) => {
  return async (c: Context, next: Next) => {
    try {
      const query = Object.fromEntries(c.req.query());
      const validated = schema.parse(query);
      c.set('validated', { ...c.get('validated'), query: validated });
      await next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw error;
      }
      throw new Error('Invalid query parameters');
    }
  };
};

export const validateParams = <T extends z.ZodType>(schema: T) => {
  return async (c: Context, next: Next) => {
    try {
      const params = c.req.param();
      const validated = schema.parse(params);
      c.set('validated', { ...c.get('validated'), params: validated });
      await next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw error;
      }
      throw new Error('Invalid path parameters');
    }
  };
};
