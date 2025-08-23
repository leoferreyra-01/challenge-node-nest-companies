export interface IUseCase<TRequest, TResponse> {
  execute(request: TRequest): Promise<TResponse>;
}

export interface ICommand<TRequest, TResponse = void>
  extends IUseCase<TRequest, TResponse> {
  execute(request: TRequest): Promise<TResponse>;
}

export interface IQuery<TRequest, TResponse>
  extends IUseCase<TRequest, TResponse> {
  execute(request: TRequest): Promise<TResponse>;
}
