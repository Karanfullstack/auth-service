import { DataSource } from 'typeorm';
import { User } from '../entity/User';
import { Config } from '.';
import { RefreshToken } from '../entity/RefreshToken';

export const AppDataSource = new DataSource({
   type: 'postgres',
   host: Config.DB_HOST,
   port: Number(Config.DB_PORT),
   username: Config.DB_USER,
   password: Config.DB_PASSWORD,
   database: Config.DB_NAME,
   synchronize: process.env.NODE_ENV === 'dev' || process.env.NODE_ENV === 'test',
   logging: false,
   entities: [User, RefreshToken],
   subscribers: [],
   migrations: [],
});
