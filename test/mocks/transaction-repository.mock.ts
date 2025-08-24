import {
  Transaction,
  TransactionType,
  TransactionStatus,
} from '../../src/domain/entities/transaction.entity';
import { ITransactionRepository } from '../../src/domain/repositories/transaction-repository.interface';

export class MockTransactionRepository implements ITransactionRepository {
  private transactions = new Map<string, Transaction>();

  // Mock data for testing
  constructor() {
    // Add some mock transactions for testing
    const mockTransaction1 = new Transaction(
      'mock-transaction-1',
      {
        companyId: 'mock-id-1',
        amount: 1000.5,
        type: TransactionType.INCOME,
        description: 'Mock transaction 1',
        status: TransactionStatus.COMPLETED,
        reference: 'MOCK-001',
        transactionDate: new Date('2023-01-15'),
      },
      new Date('2023-01-15'),
      new Date('2023-01-15'),
    );

    const mockTransaction2 = new Transaction(
      'mock-transaction-2',
      {
        companyId: 'mock-id-2',
        amount: 2500.75,
        type: TransactionType.EXPENSE,
        description: 'Mock transaction 2',
        status: TransactionStatus.COMPLETED,
        reference: 'MOCK-002',
        transactionDate: new Date('2023-02-20'),
      },
      new Date('2023-02-20'),
      new Date('2023-02-20'),
    );

    this.transactions.set('mock-transaction-1', mockTransaction1);
    this.transactions.set('mock-transaction-2', mockTransaction2);
  }

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

  async update(id: string): Promise<Transaction | null> {
    const existing = this.transactions.get(id);
    if (!existing) return null;

    // In a real implementation, you'd merge the properties
    // For testing, we'll just return the existing entity
    return existing;
  }

  async delete(id: string): Promise<boolean> {
    return this.transactions.delete(id);
  }

  async findByCompanyId(companyId: string): Promise<Transaction[]> {
    return Array.from(this.transactions.values()).filter(
      (transaction) => transaction.companyId === companyId,
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

  // Additional methods required by the interface
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

  async findByStatus(status: TransactionStatus): Promise<Transaction[]> {
    return Array.from(this.transactions.values()).filter(
      (transaction) => transaction.status === status,
    );
  }

  async findByType(type: TransactionType): Promise<Transaction[]> {
    return Array.from(this.transactions.values()).filter(
      (transaction) => transaction.type === type,
    );
  }

  async findHighValueTransactions(minAmount: number): Promise<Transaction[]> {
    return Array.from(this.transactions.values()).filter(
      (transaction) => transaction.amount >= minAmount,
    );
  }

  // Helper methods for testing
  clear(): void {
    this.transactions.clear();
  }

  getCount(): number {
    return this.transactions.size;
  }

  addMockTransaction(transaction: Transaction): void {
    this.transactions.set(transaction.id, transaction);
  }
}
