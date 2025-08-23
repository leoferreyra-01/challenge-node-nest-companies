import { Module } from '@nestjs/common';
import { CompanyRepository } from './repositories/company.repository';
import { TransactionRepository } from './repositories/transaction.repository';
import { COMPANY_REPOSITORY } from '../shared/constants/injection-tokens';
import { TRANSACTION_REPOSITORY } from '../shared/constants/injection-tokens';

@Module({
  providers: [
    {
      provide: COMPANY_REPOSITORY,
      useClass: CompanyRepository,
    },
    {
      provide: TRANSACTION_REPOSITORY,
      useClass: TransactionRepository,
    },
    CompanyRepository,
    TransactionRepository,
  ],
  exports: [COMPANY_REPOSITORY, TRANSACTION_REPOSITORY],
})
export class InfrastructureModule {}
