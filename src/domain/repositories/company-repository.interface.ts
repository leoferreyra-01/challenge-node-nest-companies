import { Company } from '../entities/company.entity';
import { IRepository } from '../../shared/interfaces/repository.interface';

export interface ICompanyRepository extends IRepository<Company> {
  findByName(name: string): Promise<Company | null>;
  findByIndustry(industry: string): Promise<Company[]>;
  findActiveCompanies(): Promise<Company[]>;
  findStartups(): Promise<Company[]>;
  findEnterprises(): Promise<Company[]>;
  findByEmployeeCountRange(min: number, max: number): Promise<Company[]>;
  findByFoundedYearRange(
    startYear: number,
    endYear: number,
  ): Promise<Company[]>;
  findCompaniesCreatedInLastMonth(): Promise<Company[]>;
}
