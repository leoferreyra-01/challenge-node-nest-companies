import { Injectable, Inject } from '@nestjs/common';
import { ICommand } from '../../../shared/interfaces/use-case.interface';
import { Transaction } from '../../../domain/entities/transaction.entity';
import { ITransactionRepository } from '../../../domain/repositories/transaction-repository.interface';
import { ICompanyRepository } from '../../../domain/repositories/company-repository.interface';
import { TRANSACTION_REPOSITORY } from '../../../shared/constants/injection-tokens';
import { COMPANY_REPOSITORY } from '../../../shared/constants/injection-tokens';
import { CreateTransactionDto } from '../../../shared/dto/create-transaction.dto';
import { v4 as uuidv4 } from 'uuid';

export interface CreateTransactionResponse {
  transaction: Transaction;
}

@Injectable()
export class CreateTransactionUseCase
  implements ICommand<CreateTransactionDto, CreateTransactionResponse>
{
  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: ITransactionRepository,
    @Inject(COMPANY_REPOSITORY)
    private readonly companyRepository: ICompanyRepository,
  ) {}

  async execute(
    request: CreateTransactionDto,
  ): Promise<CreateTransactionResponse> {
    // Business rule: Check if company exists
    const company = await this.companyRepository.findById(request.companyId);
    if (!company) {
      throw new Error(`Company with id "${request.companyId}" not found`);
    }

    // Business rule: Check if company is active
    if (!company.isActive) {
      throw new Error(
        `Cannot create transaction for inactive company "${company.name}"`,
      );
    }

    // Convert string date to Date object
    const transactionDate = new Date(request.transactionDate);

    // Create new transaction with generated ID
    const transactionId = uuidv4();
    const transaction = new Transaction(transactionId, {
      ...request,
      transactionDate,
    });

    // Persist the transaction
    const savedTransaction = await this.transactionRepository.save(transaction);

    return {
      transaction: savedTransaction,
    };
  }
}
