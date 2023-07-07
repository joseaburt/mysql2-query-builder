# mysql2-query-builder

Simple abstraction for create composable sql queries base on `mysql2` repository.

⚠️ This repo is part of a course that is in progress and maybe you can see that there is just a couple features at the moment, that is why while the course advance more features will be added. Check current one. Remember all extra queries born from a base function provided by `mysql2` and I refer to `#query` function, from this we extends and get all those custom stuffs. 😉

⚠️ This is a repo for teaching my junior students and I recommend to use more powerful solution like a ORM. However you can use this that is ready for production, more for those legacy projects that use direct string sql commands in the persistance layer.

## Connection Configuration

```ts
createDataSource(options?: ConnectionOptions): DataSource
```

By the default the when we create the `DataSource` we can pass or not the connection options, so here we have two scenarios:

1. If connection options are not passed to the `createDataSource` function, so that's why we want to use envariments variables for that connection.

| Variable          | Description       |
| ----------------- | ----------------- |
| DATABASE_HOST     | Database host     |
| DATABASE_USER     | Database username |
| DATABASE_PASSWORD | Database password |
| DATABASE_PORT     | Database port     |
| DATABASE_NAME     | Database name     |

So we can get the datasource like:

```ts
const datasource = DataSource.createDataSource();
```

2. We want to pass the connection options maybe because we want to connect to another database with different options:

So we can get the datasource like:

```ts
const datasource = DataSource.createDataSource({
  port: 3306,
  password: '',
  user: 'root',
  database: 'test',
  host: 'localhost',
});
```

## Select Query

### Select

```ts
const connection = await datasource.getConnection();

const tracks = await connection.select('*').from('tracks');
```

### Where

```ts
const trackId = 7;
const connection = await datasource.getConnection();

// SELECT * FROM tracks WHERE id = 7;
const tracks = await connection
  .select('*')
  .from('tracks')
  .where('id = ?')
  .execute([trackId]);

// SELECT title as trackTitle, album_id as albumId FROM tracks WHERE id = 7;
const tracks = await connection
  .select('title as trackTitle', 'album_id as albumId')
  .from('tracks').where('id = ?')
  .execute([trackId]);

// SELECT t.title as trackTitle, t.album_id as albumId FROM t WHERE id = 7;
const tracks = await connection
  .select('t.title as trackTitle', 't.album_id as albumId')
  .from('tracks as t').where('id = ?')
  .execute([trackId]);

// SELECT * FROM tracks WHERE id = 7 AND deleted_at IS NULL;
const tracks = await connection
  .select('*')
  .from('tracks')
  .where('id = ?', 'deleted_at IS NULL')
  .execute([trackId]);
```

### Join

You can use this join with all the posibilities that **where** and **select** (previously explained) provide you.

```ts
const fromAlbumId = 7;
const connection = await datasource.getConnection();

const artists = await connection
  .select('users.username', 'users.id', 'users.email')
  .from('album_artists')
  .join('users')
  .on('album_artists.artist_id = users.id')
  .where('album_artists.album_id = ?')
  .execute([fromAlbumId]);
```

### Here some ideas

```ts
class Mysql2Repository {
  constructor(private datasource: DataSource) {}

  public async findAlbumById(id: number): Promise<Album> {
    const connection = await this.datasource.getConnection();
    const [album] = await connection.select('*').from('albums').where('id = ?').execute([id]);

    if (!album) throw new CustomError(404, 'RECORD_NOT_FOUND', `Album with id ${id} not found`);
    return album;
  }

  public async findAllAlbumArtists(albumId: number): Promise<Artist[]> {
    const connection = await this.datasource.getConnection();
    return await connection
      .select('users.username', 'users.id', 'users.email')
      .from('album_artists')
      .join('users')
      .on('album_artists.artist_id = users.id')
      .where('album_artists.album_id = ?')
      .execute([albumId]);
  }
}
```
