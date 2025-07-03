import type { Context } from 'hono';

import type { ValidatedData } from '@/middleware/validation';
import type {
  PaginationOptions,
  TransactionFilters,
} from '@/services/transactionService';
import type {
  CreateTransactionInput,
  UpdateTransactionInput,
} from '@/types/validation';

import { TransactionService } from '@/services/transactionService';
import {
  ApiError,
  createApiResponse,
  createErrorResponse,
  createPaginationResponse,
} from '@/types/api';

export class TransactionController {
  static async getTransactions(c: Context) {
    const spaceId = c.req.param('spaceId');

    // Parse query parameters for filters and pagination
    const query = c.req.query();
    const filters: TransactionFilters = {};
    const pagination: PaginationOptions = {};

    // Parse filters
    if (query.type && ['income', 'expense'].includes(query.type)) {
      filters.type = query.type as 'income' | 'expense';
    }
    if (query.category) {
      filters.category = query.category;
    }
    if (query.startDate) {
      filters.startDate = new Date(query.startDate);
    }
    if (query.endDate) {
      filters.endDate = new Date(query.endDate);
    }

    // Parse pagination
    if (query.page) {
      pagination.page = Number.parseInt(query.page);
    }
    if (query.limit) {
      pagination.limit = Number.parseInt(query.limit);
    }

    const { limit, page, total, totalPages, transactions } =
      await TransactionService.getTransactions(spaceId, filters, pagination);
    return c.json(
      createPaginationResponse(transactions, c.req.path, {
        page,
        limit,
        total,
        totalPages,
      })
    );
  }

  static async getTransaction(c: Context) {
    const spaceId = c.req.param('spaceId');
    const transactionId = c.req.param('transactionId');

    const transaction = await TransactionService.getTransactionById(
      spaceId,
      transactionId
    );

    if (!transaction) {
      const error = new ApiError('Transaction not found', 404);
      return c.json(createErrorResponse(error, c.req.path), 404);
    }

    return c.json(createApiResponse(transaction, c.req.path));
  }

  static async createTransaction(c: Context) {
    const spaceId = c.req.param('spaceId');
    const validated = c.get(
      'validated'
    ) as ValidatedData<CreateTransactionInput>;
    const data = validated.body!;

    const transaction = await TransactionService.createTransaction(
      spaceId,
      data
    );
    return c.json(createApiResponse(transaction, c.req.path), 201);
  }

  static async updateTransaction(c: Context) {
    const spaceId = c.req.param('spaceId');
    const transactionId = c.req.param('transactionId');
    const validated = c.get(
      'validated'
    ) as ValidatedData<UpdateTransactionInput>;
    const data = validated.body!;

    const transaction = await TransactionService.updateTransaction(
      spaceId,
      transactionId,
      data
    );

    if (!transaction) {
      const error = new ApiError('Transaction not found', 404);
      return c.json(createErrorResponse(error, c.req.path), 404);
    }

    return c.json(createApiResponse(transaction, c.req.path));
  }

  static async deleteTransaction(c: Context) {
    const spaceId = c.req.param('spaceId');
    const transactionId = c.req.param('transactionId');

    const deleted = await TransactionService.deleteTransaction(
      spaceId,
      transactionId
    );

    if (!deleted) {
      const error = new ApiError('Transaction not found', 404);
      return c.json(createErrorResponse(error, c.req.path), 404);
    }

    return c.json(
      createApiResponse(
        { message: 'Transaction deleted successfully' },
        c.req.path
      )
    );
  }

  static async getSummary(c: Context) {
    const spaceId = c.req.param('spaceId');
    const summary = await TransactionService.getSummary(spaceId);
    return c.json(createApiResponse(summary, c.req.path));
  }

  static async getCategoryWiseSpending(c: Context) {
    const spaceId = c.req.param('spaceId');

    const categorySpending =
      await TransactionService.getCategoryWiseSpending(spaceId);
    return c.json(createApiResponse(categorySpending, c.req.path));
  }
}
