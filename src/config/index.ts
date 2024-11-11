import { config } from 'dotenv';
import path from 'path';
config({ path: path.join(__dirname, `../../.env.${process.env.NODE_ENV || 'dev'}`) });

const {
   PORT,
   NODE_ENV,
   BCRYPT_SALT,
   DB_NAME,
   DB_PASSWORD,
   DB_USER,
   DB_PORT,
   DB_HOST,
   REFRESH_TOKEN_SECRET,
   EXPIRES_DATE_TOKEN,
   ISSUER_TOKEN,
   HOST,
   JWKS_URI,
} = process.env;

export const Config = {
   HOST,
   PORT,
   NODE_ENV,
   DB_NAME,
   DB_PASSWORD,
   DB_USER,
   DB_PORT,
   DB_HOST,
   BCRYPT_SALT,
   REFRESH_TOKEN_SECRET,
   EXPIRES_DATE_TOKEN,
   ISSUER_TOKEN,
   JWKS_URI,
};
