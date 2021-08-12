
import type { NextApiRequest, NextApiResponse } from 'next'
import nextConnect from 'next-connect';
import { sendNotification } from '../../../services/push/push';

const post = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    const msg = req.body;

    console.log('broadcast', msg);

    await sendNotification(msg);

    res.statusCode = 200;
    res.end();
}


export default nextConnect()
    .post(post);
