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
   synchronize: false, // set to true for development or testing
   logging: false,
   entities: [User],
   subscribers: [],
   migrations: [],
});
