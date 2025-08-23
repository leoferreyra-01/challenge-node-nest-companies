import { BaseEntity } from '../../shared/base/base-entity';

export enum CompanyType {
  PYME = 'PYME',
  CORPORATE = 'CORPORATE',
}

export interface CompanyProps {
  name: string;
  description?: string;
  industry: string;
  foundedYear: number;
  employeeCount: number;
  isActive: boolean;
  type: CompanyType;
}

export class Company extends BaseEntity {
  private readonly _name: string;
  private readonly _description?: string;
  private readonly _industry: string;
  private readonly _foundedYear: number;
  private _employeeCount: number;
  private _type: CompanyType;
  private _isActive: boolean;

  constructor(
    id: string,
    props: CompanyProps,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    super(id, createdAt, updatedAt);

    this.validateCompanyData(props);

    this._name = props.name;
    this._description = props.description;
    this._industry = props.industry;
    this._foundedYear = props.foundedYear;
    this._employeeCount = props.employeeCount;
    this._isActive = props.isActive;
    this._type = props.type;
  }

  // Business logic methods
  public hireEmployees(count: number): void {
    if (count <= 0) {
      throw new Error('Employee count must be positive');
    }

    this._employeeCount += count;
    this.updateTimestamp();
  }

  public layoffEmployees(count: number): void {
    if (count <= 0) {
      throw new Error('Layoff count must be positive');
    }

    if (count > this._employeeCount) {
      throw new Error('Cannot layoff more employees than currently employed');
    }

    this._employeeCount -= count;
    this.updateTimestamp();
  }

  public deactivate(): void {
    if (this._employeeCount > 0) {
      throw new Error('Cannot deactivate company with active employees');
    }

    this._isActive = false;
    this.updateTimestamp();
  }

  public activate(): void {
    this._isActive = true;
    this.updateTimestamp();
  }

  public isStartup(): boolean {
    const currentYear = new Date().getFullYear();
    return currentYear - this._foundedYear <= 5 && this._employeeCount <= 50;
  }

  public isEnterprise(): boolean {
    return this._employeeCount > 1000;
  }

  // Getters
  get name(): string {
    return this._name;
  }

  get description(): string | undefined {
    return this._description;
  }

  get industry(): string {
    return this._industry;
  }

  get foundedYear(): number {
    return this._foundedYear;
  }

  get employeeCount(): number {
    return this._employeeCount;
  }

  get isActive(): boolean {
    return this._isActive;
  }

  get type(): CompanyType {
    return this._type;
  }

  // Validation
  private validateCompanyData(props: CompanyProps): void {
    if (!props.name || props.name.trim().length === 0) {
      throw new Error('Company name is required');
    }

    if (props.name.length > 100) {
      throw new Error('Company name cannot exceed 100 characters');
    }

    if (
      props.foundedYear < 1800 ||
      props.foundedYear > new Date().getFullYear()
    ) {
      throw new Error('Invalid founded year');
    }

    if (props.employeeCount < 0) {
      throw new Error('Employee count cannot be negative');
    }

    if (!props.industry || props.industry.trim().length === 0) {
      throw new Error('Industry is required');
    }

    if (!props.type) {
      throw new Error('Company type is required');
    }
  }

  // Domain events could be added here
  public toJSON(): Record<string, any> {
    return {
      id: this._id,
      name: this._name,
      description: this._description,
      industry: this._industry,
      foundedYear: this._foundedYear,
      employeeCount: this._employeeCount,
      isActive: this._isActive,
      type: this._type,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
}
