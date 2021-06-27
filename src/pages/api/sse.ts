import type { NextApiRequest, NextApiResponse } from 'next'
import nextConnect from 'next-connect';
import zlib from 'zlib';

/* Does not work when deploying at vercel, probably due to the proxy configuration
 * and maxDuration for connections.
 * Without using content-encoding here you get a response, but all the messages
 * are sent at once when connection closes.
 * With content-encoding the eventSource always triggers an error
 */
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
