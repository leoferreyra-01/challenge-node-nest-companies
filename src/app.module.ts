import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ApplicationModule } from './application/application.module';
import { InfrastructureModule } from './infrastructure/infrastructure.module';
import { CompanyController } from './infrastructure/controllers/company.controller';
import { TransactionController } from './infrastructure/controllers/transaction.controller';
import { ConfigModule } from './infrastructure/config/config.module';
import { ApiKeyGuard } from './infrastructure/guards/api-key.guard';

@Module({
  imports: [ConfigModule, ApplicationModule, InfrastructureModule],
  controllers: [CompanyController, TransactionController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ApiKeyGuard,
    },
  ],
})
export class AppModule {}
