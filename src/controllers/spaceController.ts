import { Context } from 'hono';
import { SpaceService } from '@/services/spaceService.ts';
import { createApiResponse } from '@/types/api.ts';

export class SpaceController {
  static async createSpace(c: Context) {
    const validated = c.get('validated');
    const data = validated.body;
    const space = await SpaceService.createSpace(data);
    return c.json(createApiResponse(space, c.req.path), 201);
  }
}
