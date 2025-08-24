import { Test } from '@nestjs/testing';
import { CompanyController } from '../../src/infrastructure/controllers/company.controller';
import { TransactionController } from '../../src/infrastructure/controllers/transaction.controller';
import { MockCompanyRepository } from '../mocks/company-repository.mock';
import { MockTransactionRepository } from '../mocks/transaction-repository.mock';
import { CreateCompanyUseCase } from '../../src/application/use-cases/company/create-company.use-case';
import { GetCompanyUseCase } from '../../src/application/use-cases/company/get-company.use-case';
import { FindCompaniesWithTransactionsLastMonthUseCase } from '../../src/application/use-cases/company/find-companies-with-transactions-last-month.use-case';
import { FindCompaniesCreatedLastMonthUseCase } from '../../src/application/use-cases/company/find-companies-created-last-month.use-case';
import { CreateTransactionUseCase } from '../../src/application/use-cases/transaction/create-transaction.use-case';
import { Company, CompanyType } from '../../src/domain/entities/company.entity';
import { Transaction } from '../../src/domain/entities/transaction.entity';
import {
  TransactionType,
  TransactionStatus,
} from '../../src/domain/entities/transaction.entity';

export class TestUtils {
  /**
   * Create a test module for CompanyController
   */
  static async createCompanyControllerTestModule() {
    const mockCompanyRepository = new MockCompanyRepository();
    const mockTransactionRepository = new MockTransactionRepository();

    const module = await Test.createTestingModule({
      controllers: [CompanyController],
      providers: [
        {
          provide: 'COMPANY_REPOSITORY',
          useValue: mockCompanyRepository,
        },
        {
          provide: 'TRANSACTION_REPOSITORY',
          useValue: mockTransactionRepository,
        },
        CreateCompanyUseCase,
        GetCompanyUseCase,
        FindCompaniesWithTransactionsLastMonthUseCase,
        FindCompaniesCreatedLastMonthUseCase,
      ],
    }).compile();

    const companyController = module.get<CompanyController>(CompanyController);
    const mockCompanyRepo = module.get(
      'COMPANY_REPOSITORY',
    ) as MockCompanyRepository;
    const mockTransactionRepo = module.get(
      'TRANSACTION_REPOSITORY',
    ) as MockTransactionRepository;

    return {
      companyController,
      mockCompanyRepository: mockCompanyRepo,
      mockTransactionRepository: mockTransactionRepo,
    };
  }

  /**
   * Create a test module for TransactionController
   */
  static async createTransactionControllerTestModule() {
    const mockCompanyRepository = new MockCompanyRepository();
    const mockTransactionRepository = new MockTransactionRepository();

    const module = await Test.createTestingModule({
      controllers: [TransactionController, CompanyController],
      providers: [
        {
          provide: 'COMPANY_REPOSITORY',
          useValue: mockCompanyRepository,
        },
        {
          provide: 'TRANSACTION_REPOSITORY',
          useValue: mockTransactionRepository,
        },
        CreateTransactionUseCase,
        CreateCompanyUseCase,
        GetCompanyUseCase,
        FindCompaniesWithTransactionsLastMonthUseCase,
        FindCompaniesCreatedLastMonthUseCase,
      ],
    }).compile();

    const transactionController = module.get<TransactionController>(
      TransactionController,
    );
    const companyController = module.get<CompanyController>(CompanyController);
    const mockCompanyRepo = module.get(
      'COMPANY_REPOSITORY',
    ) as MockCompanyRepository;
    const mockTransactionRepo = module.get(
      'TRANSACTION_REPOSITORY',
    ) as MockTransactionRepository;

    return {
      transactionController,
      companyController,
      mockCompanyRepository: mockCompanyRepo,
      mockTransactionRepository: mockTransactionRepo,
    };
  }

  /**
   * Generate a mock UUID for testing
   */
  static generateMockId(): string {
    return `mock-id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Create a mock company entity for testing
   */
  static createMockCompany(overrides: Partial<any> = {}) {
    return new Company(
      overrides.id || this.generateMockId(),
      {
        name: overrides.name || 'Mock Company',
        description: overrides.description || 'A mock company for testing',
        industry: overrides.industry || 'Technology',
        foundedYear: overrides.foundedYear || 2020,
        employeeCount: overrides.employeeCount || 100,
        isActive: overrides.isActive !== undefined ? overrides.isActive : true,
        type: overrides.type || CompanyType.PYME,
      },
      overrides.createdAt || new Date('2023-01-01'),
      overrides.updatedAt || new Date('2023-01-01'),
    );
  }

  /**
   * Create a mock transaction entity for testing
   */
  static createMockTransaction(overrides: Partial<any> = {}) {
    return new Transaction(
      overrides.id || this.generateMockId(),
      {
        companyId: overrides.companyId || 'mock-company-id',
        amount: overrides.amount || 1000.5,
        description: overrides.description || 'Mock transaction',
        type: overrides.type || TransactionType.INCOME,
        status: overrides.status || TransactionStatus.COMPLETED,
        reference: overrides.reference || 'MOCK-REF',
        transactionDate: overrides.transactionDate || new Date('2023-01-15'),
      },
      overrides.createdAt || new Date('2023-01-15'),
      overrides.updatedAt || new Date('2023-01-15'),
    );
  }

  /**
   * Mock the ConfigService for API key validation
   */
  static createMockConfigService() {
    return {
      get: jest.fn((key: string) => {
        if (key === 'apiKey') {
          return 'challenge-node-nest-companies-2025-secure-key';
        }
        return undefined;
      }),
    };
  }
}
