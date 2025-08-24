import { Company, CompanyType } from '../../src/domain/entities/company.entity';
import { ICompanyRepository } from '../../src/domain/repositories/company-repository.interface';

export class MockCompanyRepository implements ICompanyRepository {
  private companies = new Map<string, Company>();

  // Mock data for testing
  constructor() {
    // Add some mock companies for testing
    const mockCompany1 = new Company(
      'mock-id-1',
      {
        name: 'Mock Company 1',
        description: 'A mock company for testing',
        industry: 'Technology',
        foundedYear: 2020,
        employeeCount: 100,
        isActive: true,
        type: CompanyType.PYME,
      },
      new Date('2023-01-01'),
      new Date('2023-01-01'),
    );

    const mockCompany2 = new Company(
      'mock-id-2',
      {
        name: 'Mock Company 2',
        description: 'Another mock company',
        industry: 'Finance',
        foundedYear: 2018,
        employeeCount: 500,
        isActive: true,
        type: CompanyType.CORPORATE,
      },
      new Date('2023-02-01'),
      new Date('2023-02-01'),
    );

    this.companies.set('mock-id-1', mockCompany1);
    this.companies.set('mock-id-2', mockCompany2);
  }

  async findById(id: string): Promise<Company | null> {
    return this.companies.get(id) || null;
  }

  async findAll(): Promise<Company[]> {
    return Array.from(this.companies.values());
  }

  async save(entity: Company): Promise<Company> {
    this.companies.set(entity.id, entity);
    return entity;
  }

  async update(id: string): Promise<Company | null> {
    const existing = this.companies.get(id);
    if (!existing) return null;

    // In a real implementation, you'd merge the properties
    // For testing, we'll just return the existing entity
    return existing;
  }

  async delete(id: string): Promise<boolean> {
    return this.companies.delete(id);
  }

  async findByName(name: string): Promise<Company | null> {
    return (
      Array.from(this.companies.values()).find(
        (company) => company.name === name,
      ) || null
    );
  }

  async findByIndustry(industry: string): Promise<Company[]> {
    return Array.from(this.companies.values()).filter(
      (company) => company.industry === industry,
    );
  }

  async findActiveCompanies(): Promise<Company[]> {
    return Array.from(this.companies.values()).filter(
      (company) => company.isActive,
    );
  }

  async findStartups(): Promise<Company[]> {
    return Array.from(this.companies.values()).filter((company) =>
      company.isStartup(),
    );
  }

  async findEnterprises(): Promise<Company[]> {
    return Array.from(this.companies.values()).filter((company) =>
      company.isEnterprise(),
    );
  }

  async findByEmployeeCountRange(min: number, max: number): Promise<Company[]> {
    return Array.from(this.companies.values()).filter(
      (company) => company.employeeCount >= min && company.employeeCount <= max,
    );
  }

  async findByFoundedYearRange(
    startYear: number,
    endYear: number,
  ): Promise<Company[]> {
    return Array.from(this.companies.values()).filter(
      (company) =>
        company.foundedYear >= startYear && company.foundedYear <= endYear,
    );
  }

  async findCompaniesCreatedInLastMonth(): Promise<Company[]> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return Array.from(this.companies.values()).filter(
      (company) => company.createdAt >= thirtyDaysAgo,
    );
  }

  // Helper methods for testing
  clear(): void {
    this.companies.clear();
  }

  getCount(): number {
    return this.companies.size;
  }
}
