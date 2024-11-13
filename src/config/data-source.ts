import { DataSource } from 'typeorm';
import { Config } from '.';

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: Config.DB_HOST,
    port: Number(Config.DB_PORT),
    username: Config.DB_USER,
    password: Config.DB_PASSWORD,
    database: Config.DB_NAME,
    synchronize: false,
    logging: false,
    entities: ['src/entity/*.ts'],
    subscribers: [],
    migrations: ['src/migration/**/*.ts'],
});
