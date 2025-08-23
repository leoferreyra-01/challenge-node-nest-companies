import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsEnum,
  IsOptional,
  IsDateString,
  Min,
  Max,
  MaxLength,
  IsNotEmpty,
} from 'class-validator';
import {
  TransactionType,
  TransactionStatus,
} from '../../domain/entities/transaction.entity';

export class CreateTransactionDto {
  @ApiProperty({
    description: 'Company ID that this transaction belongs to',
    example: '97e4a5f0-7c83-4007-b23a-bc783ef89c93',
  })
  @IsString()
  @IsNotEmpty()
  companyId: string;

  @ApiProperty({
    description: 'Transaction amount (must be positive)',
    example: 1500.5,
    minimum: 0.01,
    maximum: 1000000000,
  })
  @IsNumber()
  @Min(0.01)
  @Max(1000000000)
  amount: number;

  @ApiProperty({
    description: 'Type of transaction',
    enum: TransactionType,
    example: TransactionType.INCOME,
  })
  @IsEnum(TransactionType)
  type: TransactionType;

  @ApiProperty({
    description: 'Transaction description',
    example: 'Monthly subscription payment',
    maxLength: 500,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  description: string;

  @ApiProperty({
    description: 'Date when the transaction occurred',
    example: '2025-08-23T10:00:00.000Z',
  })
  @IsDateString()
  transactionDate: string;

  @ApiProperty({
    description: 'Current status of the transaction',
    enum: TransactionStatus,
    example: TransactionStatus.COMPLETED,
  })
  @IsEnum(TransactionStatus)
  status: TransactionStatus;

  @ApiPropertyOptional({
    description: 'Optional reference number or identifier',
    example: 'REF-2025-001',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  reference?: string;
}
