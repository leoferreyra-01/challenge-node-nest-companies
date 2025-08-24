import { Module } from '@nestjs/common';
import { CreateCompanyUseCase } from './use-cases/company/create-company.use-case';
import { GetCompanyUseCase } from './use-cases/company/get-company.use-case';
import { FindCompaniesWithTransactionsLastMonthUseCase } from './use-cases/company/find-companies-with-transactions-last-month.use-case';
import { FindCompaniesCreatedLastMonthUseCase } from './use-cases/company/find-companies-created-last-month.use-case';
import { CreateTransactionUseCase } from './use-cases/transaction/create-transaction.use-case';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';

@Module({
  imports: [InfrastructureModule],
  providers: [
    CreateCompanyUseCase,
    GetCompanyUseCase,
    FindCompaniesWithTransactionsLastMonthUseCase,
    FindCompaniesCreatedLastMonthUseCase,
    CreateTransactionUseCase,
  ],
  exports: [
    CreateCompanyUseCase,
    GetCompanyUseCase,
    FindCompaniesWithTransactionsLastMonthUseCase,
    FindCompaniesCreatedLastMonthUseCase,
    CreateTransactionUseCase,
  ],
})
export class ApplicationModule {}
