import type { NextApiRequest, NextApiResponse } from 'next'
import nextConnect from 'next-connect';
import zlib from 'zlib';

const get = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    let active = true;

    res.writeHead(200, {
        Connection: 'keep-alive',
        'Cache-Control': 'no-cache',
        'Content-Type': 'text/event-stream;utf-8',
        'Content-Encoding': 'gzip',
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

    const stream = zlib.createGzip();

    stream.on('data', (chunk) => {
        res.write(chunk);
    });

    stream.write(`retry:${5000 + Math.round(Math.random() * 10000)}\n\n`);
    stream.flush();

    for (let i = 0; i <= 100 && active; i += 5) {
        stream.write(`id: ${Date.now()}\n`);
        stream.write('event: progress\n');
        stream.write(`data: ${i}\n\n`);
        stream.flush();
        await new Promise(resolve => setTimeout(resolve, 200));
    }
}


export default nextConnect()
    .get(get)
