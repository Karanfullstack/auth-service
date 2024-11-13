import { injectable } from 'inversify';
import { Config } from '../config';
import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';

@injectable()
class CredentialService {
    private salt: string;
    constructor() {
        this.salt = Config.BCRYPT_SALT as string;
    }
    async generateHash(password: string): Promise<string> {
        try {
            const salt = Number(this.salt) || 10;
            const hashed = await bcrypt.hash(password, salt);
            return hashed;
        } catch (error) {
            const err = createHttpError(500, 'HashPassword Error');
            throw err;
        }
    }
    async compareHash(password: string, hashed: string): Promise<boolean> {
        try {
            return await bcrypt.compare(password, hashed);
        } catch (error) {
            const err = createHttpError(500, 'Compare password Error');
            throw err;
        }
    }
}

export default CredentialService;
