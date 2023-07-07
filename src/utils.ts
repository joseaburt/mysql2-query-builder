import 'dotenv/config';
import { ConnectionOptions } from 'mysql2/promise';

export default class DataSourceUtils {
  public static makeDefaultOptions(): ConnectionOptions {
    const { DATABASE_HOST, DATABASE_USER, DATABASE_PASSWORD, DATABASE_NAME, DATABASE_PORT } = process.env;
    return {
      host: DATABASE_HOST,
      user: DATABASE_USER,
      database: DATABASE_NAME,
      password: DATABASE_PASSWORD,
      port: parseInt(DATABASE_PORT ?? '3306'),
    };
  }
}
