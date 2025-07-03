import { and, eq } from "drizzle-orm";

import type { NewSpace, Space } from "@/db/schema/spaces";
import type { CreateSpaceInput } from "@/types/validation";

import { db } from "@/config/index";
import { spaces } from "@/db/schema/spaces";
import { ApiError } from "@/types/api";

export class SpaceService {
  /**
   * Create a new space
   */
  static async createSpace(data: CreateSpaceInput): Promise<Space> {
    try {
      const newSpace: NewSpace = {
        name: data.name,
        description: data.description || null,
      };

      const [createdSpace] = await db
        .insert(spaces)
        .values(newSpace)
        .returning();

      if (!createdSpace) {
        throw new ApiError("Failed to create space", 500, "CREATE_FAILED");
      }

      return createdSpace;
    }
    catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      // Handle database constraint violations
      if (error instanceof Error && error.message.includes("duplicate")) {
        throw new ApiError(
          "A space with this name already exists",
          409,
          "DUPLICATE_SPACE",
        );
      }

      throw new ApiError("Failed to create space", 500, "DATABASE_ERROR");
    }
  }

  /**
   * Get a space by id
   */
  static async getSpaceById(id: string): Promise<Space | null> {
    try {
      const [space] = await db
        .select()
        .from(spaces)
        .where(and(eq(spaces.id, id), eq(spaces.isDeleted, false)))
        .limit(1);
      return space || null;
    }
    catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      throw new ApiError("Failed to fetch space", 500, "DATABASE_ERROR");
    }
  }

  /**
   * Soft delete a space by id
   */
  static async deleteSpace(id: string): Promise<boolean> {
    const [deletedSpace] = await db
      .update(spaces)
      .set({ isDeleted: true, updatedAt: new Date() })
      .where(and(eq(spaces.id, id), eq(spaces.isDeleted, false)))
      .returning({ id: spaces.id });
    return !!deletedSpace;
  }
}
