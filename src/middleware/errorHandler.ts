import type { Context, Next } from "hono";

import { z } from "zod";

import { ApiError, createErrorResponse } from "@/types/api";

export async function errorHandler(c: Context, next: Next) {
  try {
    await next();
  }
  catch (error) {
    console.error("Error occurred:", error);

    let apiError: ApiError;

    if (error instanceof ApiError) {
      apiError = error;
    }
    else if (error instanceof z.ZodError) {
      apiError = new ApiError(
        "Validation failed",
        400,
        "VALIDATION_ERROR",
        error.errors,
      );
    }
    else if (error instanceof Error) {
      apiError = new ApiError(
        error.message || "Internal server error",
        500,
        "INTERNAL_ERROR",
      );
    }
    else {
      apiError = new ApiError(
        "An unexpected error occurred",
        500,
        "UNKNOWN_ERROR",
      );
    }

    const errorResponse = createErrorResponse(apiError, c.req.path);

    return c.json(errorResponse);
  }
}

export function notFoundHandler(c: Context) {
  const error = new ApiError("Route not found", 404, "NOT_FOUND");
  const errorResponse = createErrorResponse(error, c.req.path);
  return c.json(errorResponse, 404);
}
