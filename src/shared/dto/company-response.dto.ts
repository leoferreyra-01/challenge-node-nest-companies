import { ApiProperty } from '@nestjs/swagger';
import { CompanyType } from 'src/domain/entities/company.entity';

export class CompanyDto {
  @ApiProperty({
    description: 'Unique company identifier',
    example: '97e4a5f0-7c83-4007-b23a-bc783ef89c93',
  })
  id: string;

  @ApiProperty({
    description: 'Company name',
    example: 'TechCorp',
  })
  name: string;

  @ApiProperty({
    description: 'Company description',
    example: 'Innovative technology company',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'Industry sector',
    example: 'Technology',
  })
  industry: string;

  @ApiProperty({
    description: 'Year the company was founded',
    example: 2020,
  })
  foundedYear: number;

  @ApiProperty({
    description: 'Number of employees',
    example: 25,
  })
  employeeCount: number;

  @ApiProperty({
    description: 'Whether the company is currently active',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'When the company was created',
    example: '2025-08-22T04:12:55.016Z',
  })
  createdAt: string;

  @ApiProperty({
    description: 'When the company was last updated',
    example: '2025-08-22T04:12:55.016Z',
  })
  updatedAt: string;

  @ApiProperty({
    description: 'Type of company',
    example: CompanyType.PYME,
    enum: CompanyType,
  })
  type: CompanyType;
}

export class CreateCompanyResponseDto {
  @ApiProperty({
    description: 'Whether the operation was successful',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Company data',
    type: CompanyDto,
  })
  data: CompanyDto;

  @ApiProperty({
    description: 'Success message',
    example: 'Company created successfully',
  })
  message: string;
}

export class GetCompanyResponseDto {
  @ApiProperty({
    description: 'Whether the operation was successful',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Company data',
    type: CompanyDto,
  })
  data: CompanyDto;

  @ApiProperty({
    description: 'Success message',
    example: 'Company retrieved successfully',
  })
  message: string;
}

export class ErrorResponseDto {
  @ApiProperty({
    description: 'Whether the operation was successful',
    example: false,
  })
  success: boolean;

  @ApiProperty({
    description: 'Error message',
    example: 'Company with name "TechCorp" already exists',
  })
  message: string;
}
