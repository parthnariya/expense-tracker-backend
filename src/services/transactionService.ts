import {
  NewTransaction,
  Transaction,
  transactions,
} from '@/db/schema/transaction.ts';
import { and, desc, eq, sql } from 'drizzle-orm';
import { db } from '@/config/index.ts';

export interface TransactionFilters {
  type?: 'income' | 'expense';
  category?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
}

export class TransactionService {
  static async createTransaction(
    spaceId: string,
    data: Omit<NewTransaction, 'spaceId'>
  ): Promise<Transaction> {
    const [transaction] = await db
      .insert(transactions)
      .values({
        ...data,
        spaceId,
      })
      .returning();

    return transaction;
  }

  static async getTransactions(
    spaceId: string,
    filters: TransactionFilters = {},
    pagination: PaginationOptions = {}
  ): Promise<{
    transactions: Transaction[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const { type, category, startDate, endDate } = filters;
    const { page = 1, limit = 10 } = pagination;

    // Build where conditions
    const whereConditions = [eq(transactions.spaceId, spaceId)];

    if (type) {
      whereConditions.push(eq(transactions.type, type));
    }

    if (category) {
      whereConditions.push(eq(transactions.category, category));
    }

    if (startDate) {
      whereConditions.push(sql`${transactions.date} >= ${startDate}`);
    }

    if (endDate) {
      whereConditions.push(sql`${transactions.date} <= ${endDate}`);
    }

    // Get total count
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(transactions)
      .where(and(...whereConditions));

    // Get paginated results
    const offset = (page - 1) * limit;
    const transactionsList = await db
      .select()
      .from(transactions)
      .where(and(...whereConditions))
      .orderBy(desc(transactions.createdAt))
      .limit(limit)
      .offset(offset);

    return {
      transactions: transactionsList,
      total: Number(count),
      page,
      limit,
      totalPages: Math.ceil(Number(count) / limit),
    };
  }

  static async getTransactionById(
    spaceId: string,
    transactionId: string
  ): Promise<Transaction | null> {
    const [transaction] = await db
      .select()
      .from(transactions)
      .where(
        and(
          eq(transactions.id, transactionId),
          eq(transactions.spaceId, spaceId)
        )
      )
      .limit(1);

    return transaction || null;
  }

  static async updateTransaction(
    spaceId: string,
    transactionId: string,
    data: Partial<Omit<NewTransaction, 'spaceId' | 'id'>>
  ): Promise<Transaction | null> {
    const [transaction] = await db
      .update(transactions)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(transactions.id, transactionId),
          eq(transactions.spaceId, spaceId)
        )
      )
      .returning();

    return transaction || null;
  }

  static async deleteTransaction(
    spaceId: string,
    transactionId: string
  ): Promise<boolean> {
    const [deletedTransaction] = await db
      .delete(transactions)
      .where(
        and(
          eq(transactions.id, transactionId),
          eq(transactions.spaceId, spaceId)
        )
      )
      .returning({ id: transactions.id });

    return !!deletedTransaction;
  }
}
