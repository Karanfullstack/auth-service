import { DataSource } from 'typeorm';
import { User } from '../entity/User';
import { Config } from '.';

export const AppDataSource = new DataSource({
   type: 'postgres',
   host: Config.DB_HOST,
   port: Number(Config.DB_PORT),
   username: Config.DB_USER,
   password: Config.DB_PASSWORD,
   database: Config.DB_NAME,
   synchronize: Config.NODE_ENV === 'dev' || Config.NODE_ENV === 'test',
   logging: true,
   entities: [User],
   subscribers: [],
   migrations: [],
});
