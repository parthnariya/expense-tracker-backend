import { Hono } from 'hono';

import { SpaceController } from '@/controllers/spaceController';
import { validateBody } from '@/middleware/validation';
import { createSpaceSchema } from '@/types/validation';

import transactions from './transactions';

const spaces = new Hono();

spaces.get('/:id', SpaceController.getSpaceById.bind(SpaceController));

spaces.post(
  '/',
  validateBody(createSpaceSchema),
  SpaceController.createSpace.bind(SpaceController)
);

spaces.route('/:spaceId/transactions', transactions);

export default spaces;
