import type { BaseValidatedData } from "@/middleware/validation";

declare module "hono" {
  interface ContextVariableMap {
    validated: BaseValidatedData;
  }
}
