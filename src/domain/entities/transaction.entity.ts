import { BaseEntity } from '../../shared/base/base-entity';

export interface TransactionProps {
  companyId: string;
  amount: number;
  type: TransactionType;
  description: string;
  transactionDate: Date;
  status: TransactionStatus;
  reference?: string;
}

export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
  TRANSFER = 'TRANSFER',
  INVESTMENT = 'INVESTMENT',
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

export class Transaction extends BaseEntity {
  private readonly _companyId: string;
  private readonly _amount: number;
  private readonly _type: TransactionType;
  private readonly _description: string;
  private readonly _transactionDate: Date;
  private _status: TransactionStatus;
  private readonly _reference?: string;

  constructor(
    id: string,
    props: TransactionProps,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    super(id, createdAt, updatedAt);

    this.validateTransactionData(props);

    this._companyId = props.companyId;
    this._amount = props.amount;
    this._type = props.type;
    this._description = props.description;
    this._transactionDate = props.transactionDate;
    this._status = props.status;
    this._reference = props.reference;
  }

  // Business logic methods
  public complete(): void {
    if (this._status === TransactionStatus.COMPLETED) {
      throw new Error('Transaction is already completed');
    }

    if (this._status === TransactionStatus.CANCELLED) {
      throw new Error('Cannot complete a cancelled transaction');
    }

    this._status = TransactionStatus.COMPLETED;
    this.updateTimestamp();
  }

  public cancel(): void {
    if (this._status === TransactionStatus.COMPLETED) {
      throw new Error('Cannot cancel a completed transaction');
    }

    if (this._status === TransactionStatus.CANCELLED) {
      throw new Error('Transaction is already cancelled');
    }

    this._status = TransactionStatus.CANCELLED;
    this.updateTimestamp();
  }

  public fail(): void {
    if (this._status === TransactionStatus.COMPLETED) {
      throw new Error('Cannot fail a completed transaction');
    }

    if (this._status === TransactionStatus.CANCELLED) {
      throw new Error('Cannot fail a cancelled transaction');
    }

    this._status = TransactionStatus.FAILED;
    this.updateTimestamp();
  }

  public isIncome(): boolean {
    return this._type === TransactionType.INCOME;
  }

  public isExpense(): boolean {
    return this._type === TransactionType.EXPENSE;
  }

  public isHighValue(): boolean {
    return this._amount >= 10000; // Business rule: transactions >= $10,000 are high value
  }

  public isRecent(): boolean {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return this._transactionDate >= thirtyDaysAgo;
  }

  // Getters
  get companyId(): string {
    return this._companyId;
  }

  get amount(): number {
    return this._amount;
  }

  get type(): TransactionType {
    return this._type;
  }

  get description(): string {
    return this._description;
  }

  get transactionDate(): Date {
    return this._transactionDate;
  }

  get status(): TransactionStatus {
    return this._status;
  }

  get reference(): string | undefined {
    return this._reference;
  }

  // Validation
  private validateTransactionData(props: TransactionProps): void {
    if (!props.companyId || props.companyId.trim().length === 0) {
      throw new Error('Company ID is required');
    }

    if (props.amount <= 0) {
      throw new Error('Transaction amount must be positive');
    }

    if (props.amount > 1000000000) {
      throw new Error('Transaction amount cannot exceed 1 billion');
    }

    if (!props.description || props.description.trim().length === 0) {
      throw new Error('Transaction description is required');
    }

    if (props.description.length > 500) {
      throw new Error('Transaction description cannot exceed 500 characters');
    }

    if (!props.transactionDate) {
      throw new Error('Transaction date is required');
    }

    if (props.transactionDate > new Date()) {
      throw new Error('Transaction date cannot be in the future');
    }

    if (props.transactionDate < new Date('1900-01-01')) {
      throw new Error('Transaction date cannot be before 1900');
    }

    if (!Object.values(TransactionType).includes(props.type)) {
      throw new Error('Invalid transaction type');
    }

    if (!Object.values(TransactionStatus).includes(props.status)) {
      throw new Error('Invalid transaction status');
    }

    if (props.reference && props.reference.length > 100) {
      throw new Error('Transaction reference cannot exceed 100 characters');
    }
  }

  public toJSON(): Record<string, any> {
    return {
      id: this._id,
      companyId: this._companyId,
      amount: this._amount,
      type: this._type,
      description: this._description,
      transactionDate: this._transactionDate,
      status: this._status,
      reference: this._reference,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
}
