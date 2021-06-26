import type { NextApiRequest, NextApiResponse } from 'next'
import nextConnect from 'next-connect';

const get = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    let active = true;

    res.writeHead(200, {
        Connection: 'keep-alive',
        'Cache-Control': 'no-cache',
        'Content-Type': 'text/event-stream;utf-8',
        'Content-Encoding': 'none',
    });
    res.on('close', () => {
        active = false;
        console.log('eventstream closed')
    });

    res.on('drain', () => {
        active = false;
        console.log('eventstream drained')
    });

    res.on('error', () => {
        active = false;
        console.log('eventstream error')
    });

    res.write(`retry:${5000 + Math.round(Math.random() * 10000)}\n\n`);

    for (let i = 0; i <= 100 && active; i += 5) {
        res.write(`id: ${Date.now()}\n`);
        res.write('event: progress\n');
        res.write(`data: ${i}\n\n`);
        await new Promise(resolve => setTimeout(resolve, 200));
    }
    res.end();
}


export default nextConnect()
    .get(get)