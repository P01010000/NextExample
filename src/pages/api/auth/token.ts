import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import { v4 as uuidv4 } from 'uuid';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { sign } from '../../../services/auth/auth';
import UserRepository from '../../../repositories/UserRepository';
import UserGroupRepository from '../../../repositories/UserGroupRepository';

const post = async (req: NextApiRequest, res: NextApiResponse) => {
    const body = req.body;

    let email: string | null;
    let password: string | null;
    const { siteId } = req.body;

    const authHeader = req.headers.authorization;

    if (authHeader?.substring(0, 6).toLowerCase() === 'basic ') {
        const payload = authHeader.substring(6).trim();
        const credentials = Buffer.from(payload, 'base64').toString();
        const splitIndex = credentials.indexOf(':');
        email = credentials.substring(0, splitIndex);
        password = credentials.substring(splitIndex + 1);
    } else {
        ({ email, password } = body);
    }

    if (!email || !password) {
        res.statusCode = 400;
        return res.end();
    }

    const userRepo = new UserRepository(siteId, new UserGroupRepository(siteId));
    const user = await userRepo.getUserByEmail(email);

    if (!user) {
        res.statusCode = 409;
        return res.end();
    }

    if (user.password !== password) {
        res.statusCode = 403;
        return res.end();
    }

    const payload = {
        type: 1,
        siteId,
        firstName: user.firstName,
        lastName: user.lastName,
        groups: user.groups,
    }

    const token = sign(payload, {
        expiresIn: '15m',
        jwtid: uuidv4(),
        subject: user.personId,
    });

    const { exp } = jwt.decode(token) as JwtPayload;

    res.setHeader('Set-Cookie', `at_${siteId}=${token};path=/;expires=${new Date(exp! * 1000).toUTCString()}`)

    res.statusCode = 200;
    res.end(token);
}


export default nextConnect()
    .post(post)
