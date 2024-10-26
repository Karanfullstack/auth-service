import winston, { Logger } from 'winston';
import { Config } from '.';

const logger: Logger = winston.createLogger({
   level: 'info',
   defaultMeta: { service: 'Auth-Service' },

   transports: [
      new winston.transports.File({
         dirname: 'logs',
         filename: 'app.log',
         level: 'info',
         silent: Config.NODE_ENV === 'test',
      }),
      new winston.transports.File({
         dirname: 'logs',
         filename: 'error.log',
         level: 'error',
         silent: Config.NODE_ENV === 'test',
      }),
      new winston.transports.Console({
         level: 'info',
         format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
         silent: Config.NODE_ENV === 'test',
      }),
   ],
});
export default logger;
