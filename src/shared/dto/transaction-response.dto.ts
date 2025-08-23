import { ApiProperty } from '@nestjs/swagger';
import {
  TransactionType,
  TransactionStatus,
} from '../../domain/entities/transaction.entity';

export class TransactionDto {
  @ApiProperty({
    description: 'Unique transaction identifier',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  id: string;

  @ApiProperty({
    description: 'Company ID that this transaction belongs to',
    example: '97e4a5f0-7c83-4007-b23a-bc783ef89c93',
  })
  companyId: string;

  @ApiProperty({
    description: 'Transaction amount',
    example: 1500.5,
  })
  amount: number;

  @ApiProperty({
    description: 'Type of transaction',
    enum: TransactionType,
    example: TransactionType.INCOME,
  })
  type: TransactionType;

  @ApiProperty({
    description: 'Transaction description',
    example: 'Monthly subscription payment',
  })
  description: string;

  @ApiProperty({
    description: 'Date when the transaction occurred',
    example: '2025-08-23T10:00:00.000Z',
  })
  transactionDate: string;

  @ApiProperty({
    description: 'Current status of the transaction',
    enum: TransactionStatus,
    example: TransactionStatus.COMPLETED,
  })
  status: TransactionStatus;

  @ApiProperty({
    description: 'Optional reference number or identifier',
    example: 'REF-2025-001',
    required: false,
  })
  reference?: string;

  @ApiProperty({
    description: 'When the transaction was created',
    example: '2025-08-23T21:30:00.000Z',
  })
  createdAt: string;

  @ApiProperty({
    description: 'When the transaction was last updated',
    example: '2025-08-23T21:30:00.000Z',
  })
  updatedAt: string;
}

export class CreateTransactionResponseDto {
  @ApiProperty({
    description: 'Whether the operation was successful',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Transaction data',
    type: TransactionDto,
  })
  data: TransactionDto;

  @ApiProperty({
    description: 'Success message',
    example: 'Transaction created successfully',
  })
  message: string;
}

export class CompaniesWithTransactionsLastMonthResponseDto {
  @ApiProperty({
    description: 'Whether the operation was successful',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Companies that had transactions in the last month',
    type: 'array',
    items: { type: 'object' }, // This will be CompanyDto
  })
  data: {
    companies: any[]; // CompanyDto[]
    totalCount: number;
    lastMonth: {
      startDate: string;
      endDate: string;
    };
  };

  @ApiProperty({
    description: 'Success message',
    example: 'Companies with transactions in last month retrieved successfully',
  })
  message: string;
}
