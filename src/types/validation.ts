import { z } from "zod";

export const createSpaceSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters")
    .trim(),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional()
    .nullable(),
});

export const spaceIdSchema = z.object({
  id: z.string().uuid("Invalid space ID"),
});

export const createTransactionSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters")
    .trim(),
  description: z
    .string()
    .max(1000, "Description must be less than 1000 characters")
    .optional()
    .nullable(),
  amount: z
    .number()
    .positive("Amount must be positive")
    .max(999999999.99, "Amount is too large"),
  type: z.enum(["income", "expense"], {
    errorMap: () => ({ message: "Type must be either income or expense" }),
  }),
  category: z
    .string()
    .max(100, "Category must be less than 100 characters")
    .optional()
    .nullable(),
  date: z
    .string()
    .datetime("Invalid date format")
    .optional()
    .transform(val => (val ? new Date(val) : new Date())),
});

export const updateTransactionSchema = createTransactionSchema.partial();

export const transactionIdSchema = z.object({
  transactionId: z.string().uuid("Invalid transaction ID"),
});

export type CreateSpaceInput = z.infer<typeof createSpaceSchema>;
export type SpaceIdParams = z.infer<typeof spaceIdSchema>;
export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>;
export type TransactionIdParams = z.infer<typeof transactionIdSchema>;
