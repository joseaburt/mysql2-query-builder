import SelectQueryBuilder from './select-query';
import mysql, { ResultSetHeader } from 'mysql2/promise';

export default class ConnectionDecorator {
  public static debug: boolean = false;
  constructor(private connection: mysql.Connection) {}

  public getRawConnection(): mysql.Connection {
    return this.connection;
  }

  public async closeConnection(): Promise<void> {
    await this.connection.end();
    if (ConnectionDecorator.debug) {
      console.log('Connection closed');
    }
  }

  public select(...columns: string[]): Pick<SelectQueryBuilder, 'from'> {
    return SelectQueryBuilder.fromConnection(this).select(...columns);
  }

  public async execute<T = any, R = any>(sql: string, values?: T): Promise<R[]> {
    const [rows] = values ? await this.connection.execute(sql, values) : await this.connection.execute(sql);
    return rows as R[];
  }

  public async update<T, P extends T = T>(table: string, payload: P, where: string, values: any[]): Promise<boolean> {
    const resultSet = await this.connection.query(`UPDATE ${table} SET ? ${where}`, [payload, values]);
    if (ConnectionDecorator.debug) {
      console.log(`UPDATE ${table} SET ? ${where}`);
      console.log(resultSet);
    }
    const result = resultSet[0] as ResultSetHeader;
    return !!result.changedRows;
  }

  public async insert<T, P extends T = T>(table: string, payload: P): Promise<number> {
    const res = await this.connection.query(`INSERT INTO ${table} SET ?`, payload);
    if (ConnectionDecorator.debug) {
      console.log(`INSERT INTO ${table} SET ?`);
      console.log(res);
    }
    const result = res[0] as ResultSetHeader;
    return result.insertId;
  }

  public async delete(table: string, where: string, values: any[]): Promise<boolean> {
    const res = await this.connection.query(`DELETE FROM ${table} ${where}`, values);
    const result = res[0] as ResultSetHeader;
    if (ConnectionDecorator.debug) {
      console.log(`DELETE FROM ${table} ${where}`);
      console.log(res);
    }
    return !!result.affectedRows;
  }
}
