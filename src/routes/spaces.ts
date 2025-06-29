import { Hono } from 'hono';
import { SpaceController } from '@/controllers/spaceController.ts';
import { createSpaceSchema } from '@/types/validation.ts';
import transactions from './transactions.ts';
import { validateBody } from '@/middleware/validation.ts';

const spaces = new Hono();

spaces.post(
  '/',
  validateBody(createSpaceSchema),
  SpaceController.createSpace.bind(SpaceController)
);

spaces.route('/:spaceId/transactions', transactions);

export default spaces;
