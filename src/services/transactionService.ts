import { and, desc, eq, sql } from 'drizzle-orm';

import type { NewTransaction, Transaction } from '@/db/schema/transaction';

import { db } from '@/config/index';
import { transactions } from '@/db/schema/transaction';

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
    const whereConditions = [
      eq(transactions.spaceId, spaceId),
      eq(transactions.isDeleted, false),
    ];

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
          eq(transactions.spaceId, spaceId),
          eq(transactions.isDeleted, false)
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
      .update(transactions)
      .set({ isDeleted: true, updatedAt: new Date() })
      .where(
        and(
          eq(transactions.id, transactionId),
          eq(transactions.spaceId, spaceId),
          eq(transactions.isDeleted, false)
        )
      )
      .returning({ id: transactions.id });

    return !!deletedTransaction;
  }

  static async getSummary(spaceId: string) {
    const [{ total: totalIncome = 0 }] = await db
      .select({ total: sql<number>`COALESCE(SUM(${transactions.amount}), 0)` })
      .from(transactions)
      .where(
        and(
          eq(transactions.spaceId, spaceId),
          eq(transactions.type, 'income'),
          eq(transactions.isDeleted, false)
        )
      );

    const [{ total: totalExpense = 0 }] = await db
      .select({ total: sql<number>`COALESCE(SUM(${transactions.amount}), 0)` })
      .from(transactions)
      .where(
        and(
          eq(transactions.spaceId, spaceId),
          eq(transactions.type, 'expense'),
          eq(transactions.isDeleted, false)
        )
      );

    return {
      totalIncome: Number(totalIncome),
      totalExpense: Number(totalExpense),
    };
  }

  static async getCategoryWiseSpending(spaceId: string) {
    const whereConditions = [
      eq(transactions.spaceId, spaceId),
      eq(transactions.type, 'expense'),
      eq(transactions.isDeleted, false),
    ];

    const categorySpending = await db
      .select({
        category: transactions.category,
        totalAmount: sql<number>`COALESCE(SUM(${transactions.amount}), 0)`,
        transactionCount: sql<number>`COUNT(*)`,
      })
      .from(transactions)
      .where(and(...whereConditions))
      .groupBy(transactions.category)
      .orderBy(sql`SUM(${transactions.amount}) DESC`);

    const [{ totalSpending = 0 }] = await db
      .select({
        totalSpending: sql<number>`COALESCE(SUM(${transactions.amount}), 0)`,
      })
      .from(transactions)
      .where(and(...whereConditions));

    const formattedSpending = categorySpending.map(item => ({
      category: item.category || 'Uncategorized',
      totalAmount: Number(item.totalAmount),
      transactionCount: Number(item.transactionCount),
      percentage:
        totalSpending > 0
          ? Math.round(
              (Number(item.totalAmount) / Number(totalSpending)) * 100 * 100
            ) / 100
          : 0,
    }));

    return {
      categories: formattedSpending,
      totalSpending: Number(totalSpending),
      totalTransactions: formattedSpending.reduce(
        (sum, item) => sum + item.transactionCount,
        0
      ),
    };
  }
}
