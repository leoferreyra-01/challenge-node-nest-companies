import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { CreateTransactionUseCase } from '../../application/use-cases/transaction/create-transaction.use-case';
import { CreateTransactionDto } from '../../shared/dto/create-transaction.dto';
import { CreateTransactionResponseDto } from '../../shared/dto/transaction-response.dto';
import { ErrorResponseDto } from '../../shared/dto/company-response.dto';

@ApiTags('transactions')
@Controller('transactions')
export class TransactionController {
  constructor(
    private readonly createTransactionUseCase: CreateTransactionUseCase,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new transaction',
    description: 'Creates a new transaction for a company',
  })
  @ApiBody({
    type: CreateTransactionDto,
    description: 'Transaction information to create',
  })
  @ApiResponse({
    status: 201,
    description: 'Transaction created successfully',
    type: CreateTransactionResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation error or business rule violation',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Company not found',
    type: ErrorResponseDto,
  })
  async createTransaction(@Body() createTransactionDto: CreateTransactionDto) {
    try {
      const result =
        await this.createTransactionUseCase.execute(createTransactionDto);
      return {
        success: true,
        data: result.transaction.toJSON(),
        message: 'Transaction created successfully',
      };
    } catch (error) {
      if (error.message.includes('not found')) {
        throw new HttpException(
          {
            success: false,
            message: error.message,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      throw new HttpException(
        {
          success: false,
          message: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
