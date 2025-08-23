import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  Min,
  Max,
  IsNotEmpty,
  IsEnum,
} from 'class-validator';
import { CompanyType } from 'src/domain/entities/company.entity';

export class CreateCompanyDto {
  @ApiProperty({
    description: 'Company name',
    example: 'TechCorp',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    description: 'Company description',
    example: 'Innovative technology company',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Industry sector',
    example: 'Technology',
  })
  @IsString()
  @IsNotEmpty()
  industry: string;

  @ApiProperty({
    description: 'Year the company was founded',
    example: 2020,
    minimum: 1800,
    maximum: 2025,
  })
  @IsNumber()
  @Min(1800)
  @Max(new Date().getFullYear())
  foundedYear: number;

  @ApiProperty({
    description: 'Number of employees',
    example: 25,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  employeeCount: number;

  @ApiProperty({
    description: 'Whether the company is currently active',
    example: true,
  })
  @IsBoolean()
  isActive: boolean;

  @ApiProperty({
    description: 'Type of company',
    example: CompanyType.PYME,
    enum: CompanyType,
  })
  @IsEnum(CompanyType)
  type: CompanyType;
}
