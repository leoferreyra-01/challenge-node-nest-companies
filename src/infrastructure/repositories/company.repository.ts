import { Injectable } from '@nestjs/common';
import { ICompanyRepository } from '../../domain/repositories/company-repository.interface';
import { Company, CompanyType } from '../../domain/entities/company.entity';

@Injectable()
export class CompanyRepository implements ICompanyRepository {
  // In a real application, this would be a database connection
  private companies: Map<string, Company> = new Map();

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

  async update(id: string, entity: Partial<Company>): Promise<Company | null> {
    const existingCompany = this.companies.get(id);
    if (!existingCompany) {
      return null;
    }
    console.log(entity);
    // In a real implementation, you'd merge the properties properly
    // For now, we'll just return the existing company
    return existingCompany;
  }

  async delete(id: string): Promise<boolean> {
    return this.companies.delete(id);
  }

  async findByName(name: string): Promise<Company | null> {
    for (const company of this.companies.values()) {
      if (company.name.toLowerCase() === name.toLowerCase()) {
        return company;
      }
    }
    return null;
  }

  async findByIndustry(industry: string): Promise<Company[]> {
    return Array.from(this.companies.values()).filter(
      (company) => company.industry.toLowerCase() === industry.toLowerCase(),
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

  async findByType(type: CompanyType): Promise<Company[]> {
    return Array.from(this.companies.values()).filter(
      (company) => company.type === type,
    );
  }
}
