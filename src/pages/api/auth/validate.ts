import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import authHandler from '../../../handler/auth';

const post = async (req: NextApiRequest, res: NextApiResponse) => {
    const response = await authHandler({ req, res });

    if (response) {
        res.statusCode = 200;
        return res.end()
    } 
    res.statusCode = 401;
    res.end()
}


export default nextConnect()
    .post(post)
