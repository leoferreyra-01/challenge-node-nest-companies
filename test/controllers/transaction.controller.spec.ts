import { TestUtils } from '../helpers/test-utils';
import { HttpException, HttpStatus } from '@nestjs/common';
import {
  TransactionType,
  TransactionStatus,
} from '../../src/domain/entities/transaction.entity';

describe('TransactionController Integration Tests', () => {
  let testModule: any;

  beforeEach(async () => {
    testModule = await TestUtils.createTransactionControllerTestModule();
  });

  afterEach(() => {
    testModule.mockCompanyRepository.clear();
    testModule.mockTransactionRepository.clear();
  });

  describe('POST /transactions', () => {
    describe('Success Scenarios', () => {
      it('should create a transaction with valid data', async () => {
        // Arrange
        const companyData = {
          name: 'Test Company for Transaction',
          industry: 'Technology',
          foundedYear: 2023,
          employeeCount: 50,
          isActive: true,
          type: 'PYME' as const,
        };

        // Create a company first
        const companyResult =
          await testModule.companyController.createCompany(companyData);
        const companyId = companyResult.data.id;

        const transactionData = {
          companyId: companyId,
          amount: 1500.75,
          description: 'Test transaction for company',
          type: TransactionType.INCOME,
          status: TransactionStatus.COMPLETED,
          reference: 'TEST-TXN-001',
          transactionDate: new Date().toISOString(),
        };

        // Act
        const result =
          await testModule.transactionController.createTransaction(
            transactionData,
          );

        // Assert
        expect(result.success).toBe(true);
        expect(result.data).toBeDefined();
        expect(result.data.companyId).toBe(companyId);
        expect(result.data.amount).toBe(transactionData.amount);
        expect(result.data.description).toBe(transactionData.description);
        expect(result.data.type).toBe(transactionData.type);
        expect(result.data.status).toBe(transactionData.status);
        expect(result.data.reference).toBe(transactionData.reference);
        expect(result.data).toHaveProperty('id');
        expect(result.data).toHaveProperty('createdAt');
        expect(result.data).toHaveProperty('updatedAt');
        expect(result.message).toBe('Transaction created successfully');
      });

      it('should create a transaction with minimal required fields', async () => {
        // Arrange
        const companyData = {
          name: 'Minimal Company',
          industry: 'Finance',
          foundedYear: 2023,
          employeeCount: 25,
          isActive: true,
          type: 'PYME' as const,
        };

        const companyResult =
          await testModule.companyController.createCompany(companyData);
        const companyId = companyResult.data.id;

        const transactionData = {
          companyId: companyId,
          amount: 500.0,
          description: 'Minimal transaction description',
          type: TransactionType.EXPENSE,
          status: TransactionStatus.PENDING,
          reference: 'MIN-TXN-001',
          transactionDate: new Date().toISOString(),
        };

        // Act
        const result =
          await testModule.transactionController.createTransaction(
            transactionData,
          );

        // Assert
        expect(result.success).toBe(true);
        expect(result.data.companyId).toBe(companyId);
        expect(result.data.amount).toBe(transactionData.amount);
        expect(result.data.type).toBe(transactionData.type);
      });
    });

    describe('Failure Scenarios', () => {
      it('should fail when company does not exist', async () => {
        // Arrange
        const transactionData = {
          companyId: 'non-existent-company-id',
          amount: 1000.0,
          description: 'Transaction for non-existent company',
          type: TransactionType.INCOME,
          status: TransactionStatus.COMPLETED,
          reference: 'FAIL-TXN-001',
          transactionDate: new Date().toISOString(),
        };

        // Act & Assert
        try {
          await testModule.transactionController.createTransaction(
            transactionData,
          );
          fail('Should have thrown an error');
        } catch (error) {
          expect(error).toBeInstanceOf(HttpException);
          expect(error.getStatus()).toBe(HttpStatus.NOT_FOUND);
          expect(error.message).toContain('Company with id');
          expect(error.message).toContain('not found');
        }
      });

      it('should fail when company is inactive', async () => {
        // Arrange
        const companyData = {
          name: 'Inactive Company',
          industry: 'Technology',
          foundedYear: 2023,
          employeeCount: 50,
          isActive: false, // Inactive company
          type: 'PYME' as const,
        };

        const companyResult =
          await testModule.companyController.createCompany(companyData);
        const companyId = companyResult.data.id;

        const transactionData = {
          companyId: companyId,
          amount: 1000.0,
          description: 'Transaction for inactive company',
          type: TransactionType.INCOME,
          status: TransactionStatus.COMPLETED,
          reference: 'INACTIVE-TXN-001',
          transactionDate: new Date().toISOString(),
        };

        // Act & Assert
        try {
          await testModule.transactionController.createTransaction(
            transactionData,
          );
          fail('Should have thrown an error');
        } catch (error) {
          expect(error).toBeInstanceOf(HttpException);
          expect(error.getStatus()).toBe(HttpStatus.BAD_REQUEST);
          expect(error.message).toContain(
            'Cannot create transaction for inactive company',
          );
        }
      });

      it('should fail validation when amount is negative', async () => {
        // Arrange
        const companyData = {
          name: 'Valid Company',
          industry: 'Technology',
          foundedYear: 2023,
          employeeCount: 50,
          isActive: true,
          type: 'PYME' as const,
        };

        const companyResult =
          await testModule.companyController.createCompany(companyData);
        const companyId = companyResult.data.id;

        const transactionData = {
          companyId: companyId,
          amount: -100.0, // Negative amount
          description: 'Transaction with negative amount',
          type: TransactionType.EXPENSE,
          status: TransactionStatus.COMPLETED,
          reference: 'NEG-TXN-001',
          transactionDate: new Date().toISOString(),
        };

        // Act & Assert
        try {
          await testModule.transactionController.createTransaction(
            transactionData,
          );
          fail('Should have thrown an error');
        } catch (error) {
          expect(error).toBeInstanceOf(HttpException);
          expect(error.getStatus()).toBe(HttpStatus.BAD_REQUEST);
        }
      });

      it('should fail validation when amount is zero', async () => {
        // Arrange
        const companyData = {
          name: 'Valid Company',
          industry: 'Technology',
          foundedYear: 2023,
          employeeCount: 50,
          isActive: true,
          type: 'PYME' as const,
        };

        const companyResult =
          await testModule.companyController.createCompany(companyData);
        const companyId = companyResult.data.id;

        const transactionData = {
          companyId: companyId,
          amount: 0, // Zero amount
          description: 'Transaction with zero amount',
          type: TransactionType.INCOME,
          status: TransactionStatus.COMPLETED,
          reference: 'ZERO-TXN-001',
          transactionDate: new Date().toISOString(),
        };

        // Act & Assert
        try {
          await testModule.transactionController.createTransaction(
            transactionData,
          );
          fail('Should have thrown an error');
        } catch (error) {
          expect(error).toBeInstanceOf(HttpException);
          expect(error.getStatus()).toBe(HttpStatus.BAD_REQUEST);
        }
      });

      it('should fail validation when description is too long', async () => {
        // Arrange
        const companyData = {
          name: 'Valid Company',
          industry: 'Technology',
          foundedYear: 2023,
          employeeCount: 50,
          isActive: true,
          type: 'PYME' as const,
        };

        const companyResult =
          await testModule.companyController.createCompany(companyData);
        const companyId = companyResult.data.id;

        const transactionData = {
          companyId: companyId,
          amount: 1000.0,
          description: 'A'.repeat(501), // Too long description
          type: TransactionType.INCOME,
          status: TransactionStatus.COMPLETED,
          reference: 'LONG-TXN-001',
          transactionDate: new Date().toISOString(),
        };

        // Act & Assert
        try {
          await testModule.transactionController.createTransaction(
            transactionData,
          );
          fail('Should have thrown an error');
        } catch (error) {
          expect(error).toBeInstanceOf(HttpException);
          expect(error.getStatus()).toBe(HttpStatus.BAD_REQUEST);
        }
      });

      it('should fail validation when reference is too long', async () => {
        // Arrange
        const companyData = {
          name: 'Valid Company',
          industry: 'Technology',
          foundedYear: 2023,
          employeeCount: 50,
          isActive: true,
          type: 'PYME' as const,
        };

        const companyResult =
          await testModule.companyController.createCompany(companyData);
        const companyId = companyResult.data.id;

        const transactionData = {
          companyId: companyId,
          amount: 1000.0,
          description: 'Valid description',
          type: TransactionType.INCOME,
          status: TransactionStatus.COMPLETED,
          reference: 'A'.repeat(101), // Too long reference
          transactionDate: new Date().toISOString(),
        };

        // Act & Assert
        try {
          await testModule.transactionController.createTransaction(
            transactionData,
          );
          fail('Should have thrown an error');
        } catch (error) {
          expect(error).toBeInstanceOf(HttpException);
          expect(error.getStatus()).toBe(HttpStatus.BAD_REQUEST);
        }
      });
    });
  });

  describe('Business Logic Integration', () => {
    it('should maintain data consistency between companies and transactions', async () => {
      // Arrange
      const companyData = {
        name: 'Integration Test Company',
        industry: 'Technology',
        foundedYear: 2023,
        employeeCount: 100,
        isActive: true,
        type: 'PYME' as const,
      };

      // Create company
      const companyResult =
        await testModule.companyController.createCompany(companyData);
      const companyId = companyResult.data.id;

      // Create multiple transactions
      const transactions = [
        {
          companyId: companyId,
          amount: 1000.0,
          description: 'First transaction',
          type: TransactionType.INCOME,
          status: TransactionStatus.COMPLETED,
          reference: 'TXN-001',
          transactionDate: new Date().toISOString(),
        },
        {
          companyId: companyId,
          amount: 500.0,
          description: 'Second transaction',
          type: TransactionType.EXPENSE,
          status: TransactionStatus.COMPLETED,
          reference: 'TXN-002',
          transactionDate: new Date().toISOString(),
        },
      ];

      // Act - Create transactions
      const transactionResults = await Promise.all(
        transactions.map((txn) =>
          testModule.transactionController.createTransaction(txn),
        ),
      );

      // Assert - All transactions created successfully
      transactionResults.forEach((result) => {
        expect(result.success).toBe(true);
        expect(result.data.companyId).toBe(companyId);
      });

      // Verify company still exists and is accessible
      const companyResult2 =
        await testModule.companyController.getCompany(companyId);
      expect(companyResult2.success).toBe(true);
      expect(companyResult2.data.id).toBe(companyId);
    });

    it('should handle different transaction types correctly', async () => {
      // Arrange
      const companyData = {
        name: 'Multi-Transaction Company',
        industry: 'Finance',
        foundedYear: 2023,
        employeeCount: 200,
        isActive: true,
        type: 'CORPORATE' as const,
      };

      const companyResult =
        await testModule.companyController.createCompany(companyData);
      const companyId = companyResult.data.id;

      const transactionTypes = [
        TransactionType.INCOME,
        TransactionType.EXPENSE,
        TransactionType.TRANSFER,
        TransactionType.INVESTMENT,
      ];

      // Act - Create transactions with different types
      const transactionResults = await Promise.all(
        transactionTypes.map((type, index) =>
          testModule.transactionController.createTransaction({
            companyId: companyId,
            amount: 1000.0 + index,
            description: `${type} transaction`,
            type: type,
            status: TransactionStatus.COMPLETED,
            reference: `TXN-${type}-${index}`,
            transactionDate: new Date().toISOString(),
          }),
        ),
      );

      // Assert - All transactions created successfully
      transactionResults.forEach((result, index) => {
        expect(result.success).toBe(true);
        expect(result.data.type).toBe(transactionTypes[index]);
      });
    });
  });
});
