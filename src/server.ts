import logger from './config/logger';
import { Config } from './config';
import app from './app';

const startServer = () => {
   try {
      console.log(Config.DB_NAME);
      app.listen(Config.PORT, () => {
         logger.info(`Server is running at http://localhost:${Config.PORT}`);
      });
   } catch (error) {
      if (error instanceof Error) {
         logger.error(error.message);
         setTimeout(() => process.exit(1), 1000);
      }
   }
};

startServer();
