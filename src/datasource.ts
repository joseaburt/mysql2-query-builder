import DataSourceUtils from './utils';
import ConnectionDecorator from './connection-decorator';
import mysql, { ConnectionOptions } from 'mysql2/promise';

export default class DataSource {
  private options: ConnectionOptions;
  private connection: ConnectionDecorator | undefined;

  private constructor(options: ConnectionOptions) {
    this.options = options;
  }

  public async getConnection(): Promise<ConnectionDecorator> {
    if (!this.connection) this.connection = new ConnectionDecorator(await mysql.createConnection(this.options));
    return this.connection;
  }

  public static createDataSource(options?: ConnectionOptions): DataSource {
    return new DataSource(options ?? DataSourceUtils.makeDefaultOptions());
  }
}
