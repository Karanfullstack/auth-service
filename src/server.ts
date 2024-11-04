import logger from './config/logger';
import { Config } from './config';
import app from './app';
import { AppDataSource } from './config/data-source';

const startServer = async () => {
   try {
      logger.info('Database ' + Config.DB_NAME);
      if (process.env.NODE_ENV === 'dev') {
         await AppDataSource.initialize();
      }
      logger.info('Database is connected sucessfully.');
      app.listen(Config.PORT, () => {
         logger.info(`Server is running at http://${Config.HOST}:${Config.PORT}`);
      });
   } catch (error: unknown) {
      if (error instanceof Error) {
         logger.error(error.message);
         setTimeout(() => process.exit(1), 1000);
      }
   }
};

void startServer();
