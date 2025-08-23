import { Injectable, Inject } from '@nestjs/common';
import { ICommand } from '../../../shared/interfaces/use-case.interface';
import { Company } from '../../../domain/entities/company.entity';
import { ICompanyRepository } from '../../../domain/repositories/company-repository.interface';
import { COMPANY_REPOSITORY } from '../../../shared/constants/injection-tokens';
import { CreateCompanyDto } from '../../../shared/dto/create-company.dto';
import { v4 as uuidv4 } from 'uuid';

export interface CreateCompanyResponse {
  company: Company;
}

@Injectable()
export class CreateCompanyUseCase
  implements ICommand<CreateCompanyDto, CreateCompanyResponse>
{
  constructor(
    @Inject(COMPANY_REPOSITORY)
    private readonly companyRepository: ICompanyRepository,
  ) {}

  async execute(request: CreateCompanyDto): Promise<CreateCompanyResponse> {
    // Business rule: Check if company name already exists
    const existingCompany = await this.companyRepository.findByName(
      request.name,
    );
    if (existingCompany) {
      throw new Error(`Company with name "${request.name}" already exists`);
    }

    // Create new company with generated ID
    const companyId = uuidv4();
    const company = new Company(companyId, request);

    // Persist the company
    const savedCompany = await this.companyRepository.save(company);

    return {
      company: savedCompany,
    };
  }
}
