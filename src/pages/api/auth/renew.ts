import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import { v4 as uuidv4 } from 'uuid';
import UserGroupRepository from '../../../repositories/UserGroupRepository';
import { invalidateJti, sign, verify } from '../../../services/auth/auth';

const post = async (req: NextApiRequest, res: NextApiResponse) => {
    const token = req.body;

    let exp: number | undefined;
    let iat: number | undefined;
    let jti: string | undefined;
    let subject: string | undefined;
    let payload;

    try {
        ({
            exp,
            iat,
            jti,
            sub: subject,
            ...payload
        } = verify(token));
    } catch (ex) {
        res.statusCode = 401;
        return res.end(ex.message);
    }

    payload.groups = await new UserGroupRepository(payload.siteId).getUserGroups(payload.siteId);

    const newToken = sign(payload, {
        expiresIn: '15m',
        jwtid: uuidv4(),
        subject,
    });

    invalidateJti(jti!, exp!);

    res.statusCode = 200;
    res.end(newToken);
}


export default nextConnect()
    .post(post)
