import { Context } from 'hono';
import { CreateSpaceInput } from '@/types/validation.ts';
import { SpaceService } from '@/services/spaceService.ts';
import { ValidatedData } from '@/middleware/validation.ts';
import { createApiResponse } from '@/types/api.ts';

export class SpaceController {
  static async createSpace(c: Context) {
    const validated = c.get('validated') as ValidatedData<CreateSpaceInput>;
    const data = validated.body!;
    const space = await SpaceService.createSpace(data);
    return c.json(createApiResponse(space, c.req.path), 201);
  }
}
