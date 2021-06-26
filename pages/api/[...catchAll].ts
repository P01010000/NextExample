import { Backend } from '../../backend/main';
import { NextApiRequest, NextApiResponse } from 'next';

const api = (req: NextApiRequest, res: NextApiResponse) => new Promise(async resolve => {
    const listener = await Backend.getListener();
    listener(req, res);
    res.on("finish", resolve);
});

export default api;
