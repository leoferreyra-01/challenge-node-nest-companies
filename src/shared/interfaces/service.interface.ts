export interface IService<TEntity> {
  create(data: Partial<TEntity>): Promise<TEntity>;
  findById(id: string): Promise<TEntity | null>;
  findAll(): Promise<TEntity[]>;
  update(id: string, data: Partial<TEntity>): Promise<TEntity | null>;
  delete(id: string): Promise<boolean>;
}

export interface IReadService<TEntity> {
  findById(id: string): Promise<TEntity | null>;
  findAll(): Promise<TEntity[]>;
}

export interface IWriteService<TEntity> {
  create(data: Partial<TEntity>): Promise<TEntity>;
  update(id: string, data: Partial<TEntity>): Promise<TEntity | null>;
  delete(id: string): Promise<boolean>;
}
