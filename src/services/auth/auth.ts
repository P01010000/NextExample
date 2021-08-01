import crypto from 'crypto';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import NodeCache from 'node-cache';

const blacklist = new NodeCache();

const createPemFromKey = (keyPair: crypto.ECDH) => {
    const privateKey = `-----BEGIN PRIVATE KEY-----
${Buffer.from(`308184020100301006072a8648ce3d020106052b8104000a046d306b0201010420${keyPair.getPrivateKey('hex')}a144034200${keyPair.getPublicKey('hex')}`, 'hex').toString('base64')}
-----END PRIVATE KEY-----`

    const publicKey = `-----BEGIN PUBLIC KEY-----
${Buffer.from(`3056301006072a8648ce3d020106052b8104000a034200${keyPair.getPublicKey('hex')}`, 'hex').toString('base64')}
-----END PUBLIC KEY-----`;

    return {
        privateKey,
        publicKey,
    };
}

const loadKeys = async () => {
    if (fs.existsSync('privateKey.pem') && fs.existsSync('publicKey.pem')) {
        const privateKey = fs.readFileSync('privateKey.pem', 'utf-8');
        const publicKey = fs.readFileSync('publicKey.pem', 'utf-8');
        return {
            privateKey,
            publicKey,
        }
    }
    const ecdh = crypto.createECDH('secp256k1');
    ecdh.generateKeys();
    const { privateKey, publicKey } = createPemFromKey(ecdh);

    fs.writeFileSync('privateKey.pem', Buffer.from(privateKey));
    fs.writeFileSync('publicKey.pem', Buffer.from(publicKey));

    return {
        privateKey,
        publicKey,
    }
}

const { privateKey, publicKey } = await loadKeys();

export class InvalidatedError extends Error {
    constructor() {
        super('invalidated');
        this.name = 'InvalidatedError';
    }
}

export const sign = (payload: string | object | Buffer, options: jwt.SignOptions) => {
    return jwt.sign(payload, privateKey, { ...options, algorithm: 'ES256' });
}

export const verify = (token: string): jwt.JwtPayload => {
    const payload = jwt.verify(token, publicKey, { algorithms: ['ES256'] }) as jwt.JwtPayload;

    if (blacklist.get(payload.jti!)) {
        throw new InvalidatedError();
    }

    return payload;
}

export const invalidateToken = (token: string) => {
    const payload = verify(token);
    if (payload.jti) {
        blacklist.set(payload.jti, true, payload.exp! - Math.floor(Date.now() / 1000));
    }
}

export const invalidateJti = (jti: string, exp: number) => {
    blacklist.set(jti, exp);
}
