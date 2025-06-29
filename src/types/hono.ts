import { BaseValidatedData } from '@/middleware/validation.ts';

declare module 'hono' {
  interface ContextVariableMap {
    validated: BaseValidatedData;
  }
}
