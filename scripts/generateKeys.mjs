import crypto from 'crypto';
import { writeFileSync } from 'fs';

const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
        type: 'pkcs1',
        format: 'pem',
    },
    privateKeyEncoding: {
        type: 'pkcs1',
        format: 'pem',
    },
});

writeFileSync('certs/private.pem', privateKey);
writeFileSync('certs/public.pem', publicKey);
