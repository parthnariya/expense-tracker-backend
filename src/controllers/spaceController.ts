import type { Context } from 'hono';

import type { ValidatedData } from '@/middleware/validation';
import type { CreateSpaceInput } from '@/types/validation';

import { SpaceService } from '@/services/spaceService';
import { createApiResponse } from '@/types/api';

export class SpaceController {
  static async createSpace(c: Context) {
    const validated = c.get('validated') as ValidatedData<CreateSpaceInput>;
    const data = validated.body!;
    const space = await SpaceService.createSpace(data);
    return c.json(createApiResponse(space, c.req.path), 201);
  }

  static async getSpaceById(c: Context) {
    const id = c.req.param('id');
    const space = await SpaceService.getSpaceById(id);
    if (!space) {
      return c.json({ error: 'Space not found' }, 404);
    }
    return c.json(createApiResponse(space, c.req.path));
  }
}
