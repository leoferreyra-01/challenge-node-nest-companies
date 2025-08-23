import { Transaction } from '../entities/transaction.entity';
import { IRepository } from '../../shared/interfaces/repository.interface';

export interface ITransactionRepository extends IRepository<Transaction> {
  findByCompanyId(companyId: string): Promise<Transaction[]>;
  findByCompanyIdAndDateRange(
    companyId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<Transaction[]>;
  findByDateRange(startDate: Date, endDate: Date): Promise<Transaction[]>;
  findByStatus(status: string): Promise<Transaction[]>;
  findByType(type: string): Promise<Transaction[]>;
  findHighValueTransactions(minAmount: number): Promise<Transaction[]>;
  findTransactionsInLastMonth(): Promise<Transaction[]>;
  findCompaniesWithTransactionsInLastMonth(): Promise<string[]>;
}
