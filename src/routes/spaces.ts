import { Hono } from 'hono';
import { SpaceController } from '@/controllers/spaceController.ts';
import { createSpaceSchema } from '@/types/validation.ts';
import { validateBody } from '@/middleware/validation.ts';

const spaces = new Hono();

// Create a new space
spaces.post(
  '/',
  validateBody(createSpaceSchema),
  SpaceController.createSpace.bind(SpaceController)
);

export default spaces;
