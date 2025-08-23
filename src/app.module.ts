import { Module } from '@nestjs/common';
import { ApplicationModule } from './application/application.module';
import { InfrastructureModule } from './infrastructure/infrastructure.module';
import { CompanyController } from './infrastructure/controllers/company.controller';
import { TransactionController } from './infrastructure/controllers/transaction.controller';

@Module({
  imports: [ApplicationModule, InfrastructureModule],
  controllers: [CompanyController, TransactionController],
})
export class AppModule {}
