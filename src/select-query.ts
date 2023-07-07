import ConnectionDecorator from './connection-decorator';

export default class SelectQueryBuilder {
  private sql: string = '';
  private connection: ConnectionDecorator | undefined;

  private constructor(sql: string, connection?: ConnectionDecorator) {
    this.sql = sql;
    this.connection = connection;
  }

  public static fromConnection(connection: ConnectionDecorator): SelectQueryBuilder {
    return new SelectQueryBuilder('', connection);
  }

  public select(...columns: string[]): Pick<SelectQueryBuilder, 'from'> {
    this.sql = 'SELECT ' + columns.join(', ') + ' ';
    return this;
  }

  public static select(...columns: string[]): Pick<SelectQueryBuilder, 'from'> {
    return new SelectQueryBuilder('SELECT ' + columns.join(', ') + ' ');
  }

  public from(table: string): Pick<SelectQueryBuilder, 'where' | 'join' | 'get' | 'execute'> {
    this.sql += 'FROM ' + table + ' ';
    return this;
  }

  public join(table: string): Pick<SelectQueryBuilder, 'on'> {
    this.sql += 'JOIN ' + table + ' ';
    return this;
  }

  public on(condition: string): Pick<SelectQueryBuilder, 'where' | 'get' | 'execute'> {
    this.sql += 'ON ' + condition + ' ';
    return this;
  }

  public where(...condition: string[]): Pick<SelectQueryBuilder, 'get' | 'execute'> {
    this.sql += 'WHERE ' + condition.join(' AND ');
    return this;
  }

  public async execute<R = any>(args?: any[]): Promise<R[]> {
    if (!this.connection) throw new Error('ConnectionNotDefined');
    return this.connection.execute(this.sql, args);
  }

  public get(): string {
    return this.sql;
  }
}
