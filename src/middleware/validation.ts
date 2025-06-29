import { Context, Next } from 'hono';
import { z } from 'zod';

export type BaseValidatedData = {
  body?: unknown;
  query?: unknown;
  params?: unknown;
};

export type ValidatedData<
  TBody = unknown,
  TQuery = unknown,
  TParams = unknown,
> = {
  body?: TBody;
  query?: TQuery;
  params?: TParams;
};

export const validateBody = <T extends z.ZodType>(schema: T) => {
  return async (c: Context, next: Next) => {
    try {
      const body: unknown = await c.req.json();
      const validatedBody = schema.parse(body) as z.infer<T>;
      const currentValidated = c.get('validated') || {};
      c.set('validated', { ...currentValidated, body: validatedBody });
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
      const queryParams = c.req.query();
      const query: Record<string, string> = Object.fromEntries(
        Object.entries(queryParams)
      );
      const validated = schema.parse(query) as z.infer<T>;
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
      const params: Record<string, string> = c.req.param();
      const validated = schema.parse(params) as z.infer<T>;
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
