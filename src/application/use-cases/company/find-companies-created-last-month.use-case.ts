import { Injectable, Inject } from '@nestjs/common';
import { IQuery } from '../../../shared/interfaces/use-case.interface';
import { Company } from '../../../domain/entities/company.entity';
import { ICompanyRepository } from '../../../domain/repositories/company-repository.interface';
import { COMPANY_REPOSITORY } from '../../../shared/constants/injection-tokens';

export interface FindCompaniesCreatedLastMonthResponse {
  companies: Company[];
  totalCount: number;
  lastMonth: {
    startDate: Date;
    endDate: Date;
  };
}

@Injectable()
export class FindCompaniesCreatedLastMonthUseCase
  implements
    IQuery<Record<string, never>, FindCompaniesCreatedLastMonthResponse>
{
  constructor(
    @Inject(COMPANY_REPOSITORY)
    private readonly companyRepository: ICompanyRepository,
  ) {}

  async execute(): Promise<FindCompaniesCreatedLastMonthResponse> {
    // Calculate last 30 days (rolling window)
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    // Get companies created in the last 30 days
    const companies =
      await this.companyRepository.findCompaniesCreatedInLastMonth();

    return {
      companies,
      totalCount: companies.length,
      lastMonth: { startDate, endDate },
    };
  }
}
