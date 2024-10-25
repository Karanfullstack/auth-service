import { Config } from './config';
import app from './app';
import logger from './config/logger';

const startServer = () => {
   try {
      app.listen(Config.PORT, () => {
         logger.info(`Server is running at http://localhost:${Config.PORT}`);
      });
      console.log(Config.DB_NAME);
   } catch (error) {
      if (error instanceof Error) {
         logger.error(error.message);
         setTimeout(() => process.exit(1), 1000);
      }
   }
};

startServer();
