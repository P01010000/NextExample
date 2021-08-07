import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import { getBlacklist } from '../../../services/auth/auth';


const encode = (blacklist: { [key: string]: number }): Buffer => {
    const binary = Object.entries(blacklist).map(([k, v]) => {
        const value = k.replace(/-/g, '') + v.toString(16).padStart(4, '0');
        return Buffer.from(value.match(/.{2}/g)!.map((a, i) => Number.parseInt(a, 16)));
    });

    return Buffer.concat(binary);
}

const decode = (buffer: Buffer): { [key: string]: number } => {
    const blacklist: { [key: string]: number } = {};

    for (let i = 0; i < buffer.byteLength / 40; i++) {
        const rawJti = buffer.subarray(i * 40, i * 40 + 16);
        const rawExp = buffer.subarray(i * 40 + 16, i * 40 + 20);
        let jti = '';
        for (let j = 0; j < rawJti.length; j++) {
            jti += rawJti[j].toString(16).padStart(2, '0');
        }
        let exp = 0;
        for (let j = 0; j < rawExp.length; j++) {
            exp = (exp << 8) | rawExp[j];
        }
        blacklist[jti] = exp;
    }

    return blacklist;
}

const get = async (req: NextApiRequest, res: NextApiResponse) => {
    let closed = false;
    
    req.on('close', () => { 
        closed = true;
    });
    
    const blacklist = getBlacklist();
    
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/octet-stream');
    
    return res.end(encode(blacklist));
}

export default nextConnect()
    .get(get)
