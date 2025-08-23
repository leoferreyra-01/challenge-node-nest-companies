import { Injectable, Inject } from '@nestjs/common';
import { IQuery } from '../../../shared/interfaces/use-case.interface';
import { Company } from '../../../domain/entities/company.entity';
import { ICompanyRepository } from '../../../domain/repositories/company-repository.interface';
import { COMPANY_REPOSITORY } from '../../../shared/constants/injection-tokens';

export interface GetCompanyRequest {
  id: string;
}

export interface GetCompanyResponse {
  company: Company;
}

@Injectable()
export class GetCompanyUseCase
  implements IQuery<GetCompanyRequest, GetCompanyResponse>
{
  constructor(
    @Inject(COMPANY_REPOSITORY)
    private readonly companyRepository: ICompanyRepository,
  ) {}

  async execute(request: GetCompanyRequest): Promise<GetCompanyResponse> {
    const company = await this.companyRepository.findById(request.id);

    if (!company) {
      throw new Error(`Company with id "${request.id}" not found`);
    }

    return {
      company,
    };
  }
}
