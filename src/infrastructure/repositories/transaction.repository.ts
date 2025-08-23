import { Injectable } from '@nestjs/common';
import { ITransactionRepository } from '../../domain/repositories/transaction-repository.interface';
import { Transaction } from '../../domain/entities/transaction.entity';

@Injectable()
export class TransactionRepository implements ITransactionRepository {
  // In a real application, this would be a database connection
  private transactions: Map<string, Transaction> = new Map();

  async findById(id: string): Promise<Transaction | null> {
    return this.transactions.get(id) || null;
  }

  async findAll(): Promise<Transaction[]> {
    return Array.from(this.transactions.values());
  }

  async save(entity: Transaction): Promise<Transaction> {
    this.transactions.set(entity.id, entity);
    return entity;
  }

  async update(
    id: string,
    entity: Partial<Transaction>,
  ): Promise<Transaction | null> {
    const existingTransaction = this.transactions.get(id);
    if (!existingTransaction) {
      return null;
    }

    console.log(entity);
    // In a real implementation, you'd merge the properties properly
    // For now, we'll just return the existing transaction
    return existingTransaction;
  }

  async delete(id: string): Promise<boolean> {
    return this.transactions.delete(id);
  }

  async findByCompanyId(companyId: string): Promise<Transaction[]> {
    return Array.from(this.transactions.values()).filter(
      (transaction) => transaction.companyId === companyId,
    );
  }

  async findByCompanyIdAndDateRange(
    companyId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<Transaction[]> {
    return Array.from(this.transactions.values()).filter(
      (transaction) =>
        transaction.companyId === companyId &&
        transaction.transactionDate >= startDate &&
        transaction.transactionDate <= endDate,
    );
  }

  async findByDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<Transaction[]> {
    return Array.from(this.transactions.values()).filter(
      (transaction) =>
        transaction.transactionDate >= startDate &&
        transaction.transactionDate <= endDate,
    );
  }

  async findByStatus(status: string): Promise<Transaction[]> {
    return Array.from(this.transactions.values()).filter(
      (transaction) => transaction.status === status,
    );
  }

  async findByType(type: string): Promise<Transaction[]> {
    return Array.from(this.transactions.values()).filter(
      (transaction) => transaction.type === type,
    );
  }

  async findHighValueTransactions(minAmount: number): Promise<Transaction[]> {
    return Array.from(this.transactions.values()).filter(
      (transaction) => transaction.amount >= minAmount,
    );
  }

  async findTransactionsInLastMonth(): Promise<Transaction[]> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return Array.from(this.transactions.values()).filter(
      (transaction) => transaction.transactionDate >= thirtyDaysAgo,
    );
  }

  async findCompaniesWithTransactionsInLastMonth(): Promise<string[]> {
    const transactions = await this.findTransactionsInLastMonth();
    const companyIds = new Set<string>();

    transactions.forEach((transaction) => {
      companyIds.add(transaction.companyId);
    });

    return Array.from(companyIds);
  }
}
