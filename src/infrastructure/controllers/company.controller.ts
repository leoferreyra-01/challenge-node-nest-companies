import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { CreateCompanyUseCase } from '../../application/use-cases/company/create-company.use-case';
import { GetCompanyUseCase } from '../../application/use-cases/company/get-company.use-case';
import { FindCompaniesWithTransactionsLastMonthUseCase } from '../../application/use-cases/company/find-companies-with-transactions-last-month.use-case';
import { CreateCompanyDto } from '../../shared/dto/create-company.dto';
import {
  CreateCompanyResponseDto,
  GetCompanyResponseDto,
  ErrorResponseDto,
} from '../../shared/dto/company-response.dto';
import { CompaniesWithTransactionsLastMonthResponseDto } from '../../shared/dto/transaction-response.dto';

@ApiTags('companies')
@Controller('companies')
export class CompanyController {
  constructor(
    private readonly createCompanyUseCase: CreateCompanyUseCase,
    private readonly getCompanyUseCase: GetCompanyUseCase,
    private readonly findCompaniesWithTransactionsLastMonthUseCase: FindCompaniesWithTransactionsLastMonthUseCase,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new company',
    description: 'Creates a new company with the provided information',
  })
  @ApiBody({
    type: CreateCompanyDto,
    description: 'Company information to create',
  })
  @ApiResponse({
    status: 201,
    description: 'Company created successfully',
    type: CreateCompanyResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation error or business rule violation',
    type: ErrorResponseDto,
  })
  async createCompany(@Body() createCompanyDto: CreateCompanyDto) {
    try {
      const result = await this.createCompanyUseCase.execute(createCompanyDto);
      return {
        success: true,
        data: result.company.toJSON(),
        message: 'Company created successfully',
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get company by ID',
    description: 'Retrieves a company by its unique identifier',
  })
  @ApiParam({
    name: 'id',
    description: 'Company unique identifier',
    example: '97e4a5f0-7c83-4007-b23a-bc783ef89c93',
  })
  @ApiResponse({
    status: 200,
    description: 'Company retrieved successfully',
    type: GetCompanyResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Company not found',
    type: ErrorResponseDto,
  })
  async getCompany(@Param('id') id: string) {
    try {
      const result = await this.getCompanyUseCase.execute({ id });
      return {
        success: true,
        data: result.company.toJSON(),
        message: 'Company retrieved successfully',
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Get('with-transactions/last-month')
  @ApiOperation({
    summary: 'Get companies with transactions in the last month',
    description:
      'Retrieves all companies that had transactions in the last 30 days',
  })
  @ApiResponse({
    status: 200,
    description:
      'Companies with transactions in last month retrieved successfully',
    type: CompaniesWithTransactionsLastMonthResponseDto,
  })
  async getCompaniesWithTransactionsLastMonth() {
    try {
      const result =
        await this.findCompaniesWithTransactionsLastMonthUseCase.execute();
      return {
        success: true,
        data: {
          companies: result.companies.map((company) => company.toJSON()),
          totalCount: result.totalCount,
          lastMonth: {
            startDate: result.lastMonth.startDate.toISOString(),
            endDate: result.lastMonth.endDate.toISOString(),
          },
        },
        message:
          'Companies with transactions in last month retrieved successfully',
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
