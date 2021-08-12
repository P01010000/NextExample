
import type { NextApiRequest, NextApiResponse } from 'next'
import nextConnect from 'next-connect';
import { saveToDatabase } from '../../../services/push/push';

const post = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    const subscription = req.body;

    console.log('subscribe', subscription);

    await saveToDatabase(subscription);

    res.statusCode = 200;
    res.end();
}


export default nextConnect()
    .post(post);
