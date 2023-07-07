import DataSource, { ConnectionDecorator } from '../src/index';

describe('Database Connection', () => {
  it('should connect to a new database with the given optional connection options', async () => {
    const datasource = DataSource.createDataSource({
      port: 3306,
      password: '',
      user: 'root',
      database: 'test',
      host: 'localhost',
    });

    const connection = await datasource.getConnection();
    const result = await connection.execute('SELECT 1');

    expect(result.length).toBe(1);
    expect(result[0]).toEqual(expect.objectContaining({ '1': 1 }));

    connection.closeConnection();
  });

  it('should connect to a new database with environment variables if connection options argument is not passed', async () => {
    const datasource = DataSource.createDataSource();

    const connection = await datasource.getConnection();
    const result = await connection.execute('SELECT 1');

    expect(result.length).toBe(1);
    expect(result[0]).toEqual(expect.objectContaining({ '1': 1 }));

    connection.closeConnection();
  });
});

describe('Select Query Builder', () => {
  let connection: ConnectionDecorator;

  beforeAll(async () => {
    connection = await DataSource.createDataSource().getConnection();
    await connection.execute('TRUNCATE TABLE musics');
    await connection.execute('ALTER TABLE musics AUTO_INCREMENT = 1');
    await connection.insert('musics', { title: 'Home' });
  });

  afterAll(async () => {
    await connection.execute('TRUNCATE TABLE musics');
    connection.closeConnection();
  });

  it('should select the correct row based on a WHERE condition', async () => {
    const result = await connection.select('*').from('musics').where('title = ?').execute(['Home']);
    expect(result.length).toBe(1);
    expect(result[0]).toEqual(expect.objectContaining({ title: 'Home' }));
  });

  it('should return an empty array if no matching rows are found', async () => {
    const result = await connection.select('*').from('musics').where('title = ?').execute(['Nonexistent']);
    expect(result.length).toBe(0);
  });
});
