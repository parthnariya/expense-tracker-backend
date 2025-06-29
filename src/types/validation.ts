import { z } from 'zod';

export const createSpaceSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters')
    .trim(),
  description: z
    .string()
    .max(500, 'Description must be less than 500 characters')
    .optional()
    .nullable(),
});

export const spaceIdSchema = z.object({
  id: z.string().uuid('Invalid space ID'),
});

export type CreateSpaceInput = z.infer<typeof createSpaceSchema>;
export type SpaceIdParams = z.infer<typeof spaceIdSchema>;
