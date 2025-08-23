import { Injectable, Inject } from '@nestjs/common';
import { IQuery } from '../../../shared/interfaces/use-case.interface';
import { Company } from '../../../domain/entities/company.entity';
import { ICompanyRepository } from '../../../domain/repositories/company-repository.interface';
import { ITransactionRepository } from '../../../domain/repositories/transaction-repository.interface';
import { COMPANY_REPOSITORY } from '../../../shared/constants/injection-tokens';
import { TRANSACTION_REPOSITORY } from '../../../shared/constants/injection-tokens';

export interface FindCompaniesWithTransactionsLastMonthResponse {
  companies: Company[];
  totalCount: number;
  lastMonth: {
    startDate: Date;
    endDate: Date;
  };
}

@Injectable()
export class FindCompaniesWithTransactionsLastMonthUseCase
  implements
    IQuery<
      Record<string, never>,
      FindCompaniesWithTransactionsLastMonthResponse
    >
{
  constructor(
    @Inject(COMPANY_REPOSITORY)
    private readonly companyRepository: ICompanyRepository,
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: ITransactionRepository,
  ) {}

  async execute(): Promise<FindCompaniesWithTransactionsLastMonthResponse> {
    // Calculate last month's date range
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      0,
      23,
      59,
      59,
      999,
    );

    // Get company IDs that had transactions in the last month
    const companyIds =
      await this.transactionRepository.findCompaniesWithTransactionsInLastMonth();

    if (companyIds.length === 0) {
      return {
        companies: [],
        totalCount: 0,
        lastMonth: { startDate, endDate },
      };
    }

    // Fetch the actual company entities
    const companies: Company[] = [];
    for (const companyId of companyIds) {
      const company = await this.companyRepository.findById(companyId);
      if (company) {
        companies.push(company);
      }
    }

    return {
      companies,
      totalCount: companies.length,
      lastMonth: { startDate, endDate },
    };
  }
}
