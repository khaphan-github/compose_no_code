export class ExecutedSQLQueryEvent {
  constructor(
    public readonly commandQuery: string,
    public readonly input: object,
    public readonly output?: object,
    public readonly message?: string,
  ) { }
}