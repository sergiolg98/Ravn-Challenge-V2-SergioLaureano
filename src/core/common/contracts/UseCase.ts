export interface UseCase<Input, Output> {
  execute(input: Input): Promise<Output>;
}

export interface UseCaseDoubleEntry<Input, Input1, Output> {
  execute(input: Input, input1: Input1): Promise<Output>;
}
