import { TestUtils } from '../helpers/test-utils';
import { CompanyFixtures } from '../fixtures/company.fixtures';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('CompanyController Integration Tests', () => {
  let testModule: any;

  beforeEach(async () => {
    testModule = await TestUtils.createCompanyControllerTestModule();
  });

  afterEach(() => {
    testModule.mockCompanyRepository.clear();
    testModule.mockTransactionRepository.clear();
  });

  describe('POST /companies', () => {
    describe('Success Scenarios', () => {
      it('should create a company with valid data', async () => {
        // Arrange
        const companyData = CompanyFixtures.validCompany;

        // Act
        const result =
          await testModule.companyController.createCompany(companyData);

        // Assert
        expect(result.success).toBe(true);
        expect(result.data).toBeDefined();
        expect(result.data.name).toBe(companyData.name);
        expect(result.data.industry).toBe(companyData.industry);
        expect(result.data.type).toBe(companyData.type);
        expect(result.data).toHaveProperty('id');
        expect(result.data).toHaveProperty('createdAt');
        expect(result.data).toHaveProperty('updatedAt');
        expect(result.message).toBe('Company created successfully');
      });

      it('should create a company with minimal required fields', async () => {
        // Arrange
        const companyData = CompanyFixtures.minimalCompany;

        // Act
        const result =
          await testModule.companyController.createCompany(companyData);

        // Assert
        expect(result.success).toBe(true);
        expect(result.data.name).toBe(companyData.name);
        expect(result.data.industry).toBe(companyData.industry);
        expect(result.data.type).toBe(companyData.type);
      });

      it('should create an enterprise company', async () => {
        // Arrange
        const companyData = CompanyFixtures.enterpriseCompany;

        // Act
        const result =
          await testModule.companyController.createCompany(companyData);

        // Assert
        expect(result.success).toBe(true);
        expect(result.data.type).toBe('CORPORATE');
        expect(result.data.employeeCount).toBe(2500);
      });
    });

    describe('Failure Scenarios', () => {
      it('should fail when company name already exists', async () => {
        // Arrange
        const companyData = CompanyFixtures.validCompany;

        // First create a company
        await testModule.companyController.createCompany(companyData);

        // Try to create another with the same name
        const duplicateCompanyData = { ...companyData };

        // Act & Assert
        try {
          await testModule.companyController.createCompany(
            duplicateCompanyData,
          );
          fail('Should have thrown an error');
        } catch (error) {
          expect(error).toBeInstanceOf(HttpException);
          expect(error.getStatus()).toBe(HttpStatus.BAD_REQUEST);
          expect(error.message).toContain('already exists');
        }
      });

      it('should fail validation when company name is empty', async () => {
        // Arrange
        const companyData = { ...CompanyFixtures.validCompany, name: '' };

        // Act & Assert
        try {
          await testModule.companyController.createCompany(companyData);
          fail('Should have thrown an error');
        } catch (error) {
          expect(error).toBeInstanceOf(HttpException);
          expect(error.getStatus()).toBe(HttpStatus.BAD_REQUEST);
        }
      });

      it('should fail validation when founded year is too old', async () => {
        // Arrange
        const companyData = {
          ...CompanyFixtures.validCompany,
          foundedYear: 1799,
        };

        // Act & Assert
        try {
          await testModule.companyController.createCompany(companyData);
          fail('Should have thrown an error');
        } catch (error) {
          expect(error).toBeInstanceOf(HttpException);
          expect(error.getStatus()).toBe(HttpStatus.BAD_REQUEST);
        }
      });

      it('should fail validation when employee count is negative', async () => {
        // Arrange
        const companyData = {
          ...CompanyFixtures.validCompany,
          employeeCount: -5,
        };

        // Act & Assert
        try {
          await testModule.companyController.createCompany(companyData);
          fail('Should have thrown an error');
        } catch (error) {
          expect(error).toBeInstanceOf(HttpException);
          expect(error.getStatus()).toBe(HttpStatus.BAD_REQUEST);
        }
      });
    });
  });

  describe('GET /companies/:id', () => {
    let createdCompanyId: string;

    beforeEach(async () => {
      // Create a company to test with
      const result = await testModule.companyController.createCompany(
        CompanyFixtures.validCompany,
      );
      createdCompanyId = result.data.id;
    });

    describe('Success Scenarios', () => {
      it('should retrieve a company by ID', async () => {
        // Act
        const result =
          await testModule.companyController.getCompany(createdCompanyId);

        // Assert
        expect(result.success).toBe(true);
        expect(result.data).toBeDefined();
        expect(result.data.id).toBe(createdCompanyId);
        expect(result.data.name).toBe(CompanyFixtures.validCompany.name);
        expect(result.data.industry).toBe(
          CompanyFixtures.validCompany.industry,
        );
        expect(result.data.type).toBe(CompanyFixtures.validCompany.type);
        expect(result.message).toBe('Company retrieved successfully');
      });
    });

    describe('Failure Scenarios', () => {
      it('should fail when company ID does not exist', async () => {
        // Arrange
        const nonExistentId = 'non-existent-id-12345';

        // Act & Assert
        try {
          await testModule.companyController.getCompany(nonExistentId);
          fail('Should have thrown an error');
        } catch (error) {
          expect(error).toBeInstanceOf(HttpException);
          expect(error.getStatus()).toBe(HttpStatus.NOT_FOUND);
          expect(error.message).toContain('Company with id');
          expect(error.message).toContain('not found');
        }
      });
    });
  });

  describe('GET /companies/created/last-month', () => {
    describe('Success Scenarios', () => {
      it('should return companies created in last month', async () => {
        // Arrange
        const companyData = CompanyFixtures.validCompany;
        await testModule.companyController.createCompany(companyData);

        // Act
        const result =
          await testModule.companyController.getCompaniesCreatedLastMonth();

        // Assert
        expect(result.success).toBe(true);
        expect(result.data).toBeDefined();
        expect(result.data.companies).toBeDefined();
        expect(Array.isArray(result.data.companies)).toBe(true);
        expect(result.data.totalCount).toBeGreaterThan(0);
        expect(result.data.lastMonth).toBeDefined();
        expect(result.data.lastMonth).toHaveProperty('startDate');
        expect(result.data.lastMonth).toHaveProperty('endDate');
        expect(result.message).toBe(
          'Companies created in last month retrieved successfully',
        );
      });

      it('should return empty list when no companies created recently', async () => {
        // Clear the mock repository to ensure no recent companies
        testModule.mockCompanyRepository.clear();

        // Act
        const result =
          await testModule.companyController.getCompaniesCreatedLastMonth();

        // Assert
        expect(result.success).toBe(true);
        expect(result.data.companies).toEqual([]);
        expect(result.data.totalCount).toBe(0);
      });
    });
  });

  describe('GET /companies/with-transactions/last-month', () => {
    describe('Success Scenarios', () => {
      it('should return companies with transactions in last month', async () => {
        // Act
        const result =
          await testModule.companyController.getCompaniesWithTransactionsLastMonth();

        // Assert
        expect(result.success).toBe(true);
        expect(result.data).toBeDefined();
        expect(result.data.companies).toBeDefined();
        expect(Array.isArray(result.data.companies)).toBe(true);
        expect(result.data.totalCount).toBeDefined();
        expect(result.data.lastMonth).toBeDefined();
        expect(result.data.lastMonth).toHaveProperty('startDate');
        expect(result.data.lastMonth).toHaveProperty('endDate');
        expect(result.message).toBe(
          'Companies with transactions in last month retrieved successfully',
        );
      });

      it('should return empty list when no companies have transactions', async () => {
        // Clear the mock repositories to ensure no data
        testModule.mockCompanyRepository.clear();
        testModule.mockTransactionRepository.clear();

        // Act
        const result =
          await testModule.companyController.getCompaniesWithTransactionsLastMonth();

        // Assert
        expect(result.success).toBe(true);
        expect(result.data.companies).toEqual([]);
        expect(result.data.totalCount).toBe(0);
      });
    });
  });

  describe('Business Logic Integration', () => {
    it('should maintain data consistency across operations', async () => {
      // Arrange
      const companyData = CompanyFixtures.validCompany;

      // Act - Create company
      const createResult =
        await testModule.companyController.createCompany(companyData);
      const companyId = createResult.data.id;

      // Retrieve the company
      const getResult =
        await testModule.companyController.getCompany(companyId);

      // Check companies created in last month
      const lastMonthResult =
        await testModule.companyController.getCompaniesCreatedLastMonth();

      // Assert - Data consistency
      expect(createResult.data.id).toBe(getResult.data.id);
      expect(createResult.data.name).toBe(getResult.data.name);
      expect(lastMonthResult.data.companies).toContainEqual(
        expect.objectContaining({ id: companyId, name: companyData.name }),
      );
    });

    it('should handle multiple company operations correctly', async () => {
      // Arrange
      const companies = [
        CompanyFixtures.validCompany,
        CompanyFixtures.minimalCompany,
        CompanyFixtures.enterpriseCompany,
      ];

      // Act - Create multiple companies
      const createResults = await Promise.all(
        companies.map((company) =>
          testModule.companyController.createCompany(company),
        ),
      );

      // Assert - All companies created successfully
      createResults.forEach((result) => {
        expect(result.success).toBe(true);
        expect(result.data).toHaveProperty('id');
        expect(result.data).toHaveProperty('name');
      });

      // Verify total count
      const lastMonthResult =
        await testModule.companyController.getCompaniesCreatedLastMonth();
      expect(lastMonthResult.data.totalCount).toBe(companies.length);
    });
  });
});
