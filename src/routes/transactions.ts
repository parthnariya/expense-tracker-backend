import { Hono } from 'hono';

import { TransactionController } from '@/controllers/transactionController';
import { validateBody, validateParams } from '@/middleware/validation';
import {
  createTransactionSchema,
  // spaceIdSchema,
  transactionIdSchema,
  updateTransactionSchema,
} from '@/types/validation';

const transactions = new Hono();

// Apply spaceId validation to all routes
// transactions.use('*', validateParams(spaceIdSchema));

// GET /api/spaces/:spaceId/transactions - Fetch all transactions with pagination and filters
transactions.get(
  '/',
  TransactionController.getTransactions.bind(TransactionController)
);

// GET /api/spaces/:spaceId/transactions/summary - Fetch total income and total expense
transactions.get(
  '/summary',
  TransactionController.getSummary.bind(TransactionController)
);

// GET /api/spaces/:spaceId/transactions/category-spending - Fetch category-wise spending
transactions.get(
  '/category-spending',
  TransactionController.getCategoryWiseSpending.bind(TransactionController)
);

// POST /api/spaces/:spaceId/transactions - Add a new transaction
transactions.post(
  '/',
  validateBody(createTransactionSchema),
  TransactionController.createTransaction.bind(TransactionController)
);

// Apply transactionId validation to routes that need it
transactions.use('/:transactionId/*', validateParams(transactionIdSchema));

// PUT /api/spaces/:spaceId/transactions/:transactionId - Update a transaction
transactions.put(
  '/:transactionId',
  validateBody(updateTransactionSchema),
  TransactionController.updateTransaction.bind(TransactionController)
);

// DELETE /api/spaces/:spaceId/transactions/:transactionId - Delete a transaction
transactions.delete(
  '/:transactionId',
  TransactionController.deleteTransaction.bind(TransactionController)
);

export default transactions;
