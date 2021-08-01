import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import authHandler from '../../../handler/auth';
import { invalidateJti } from '../../../services/auth/auth';

const post = async (req: NextApiRequest, res: NextApiResponse) => {

    const response = await authHandler({ req, res });
    if (!response) {
        res.statusCode = 403;
        return res.end();
    }

    invalidateJti(response.payload.jti!, response.payload.exp!);

    res.statusCode = 200;
    res.end();
}


export default nextConnect()
    .post(post)
