export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
    details?: unknown;
  };
  meta?: {
    timestamp: string;
    path: string;
  };
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: {
    timestamp: string;
    path: string;
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export class ApiError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public code?: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function createApiResponse<T>(data: T, path: string): ApiResponse<T> {
  return {
    success: true,
    data,
    meta: {
      timestamp: new Date().toISOString(),
      path,
    },
  };
}

export function createPaginationResponse<T>(
  data: T[],
  path: string,
  paginationData: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  }
): PaginatedResponse<T> {
  return {
    success: true,
    data,
    meta: {
      timestamp: new Date().toISOString(),
      path,
      pagination: paginationData,
    },
  };
}

export function createErrorResponse(
  error: ApiError,
  path: string
): ApiResponse<undefined> {
  return {
    success: false,
    error: {
      message: error.message,
      code: error.code,
      details: error.details,
    },
    meta: {
      timestamp: new Date().toISOString(),
      path,
    },
  };
}
