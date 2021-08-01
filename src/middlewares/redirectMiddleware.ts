
import type { GetServerSidePropsMiddleware } from '../utils/middleware';

declare module 'http' {
    export interface IncomingMessage {
        state?: {
            site?: {
                siteId: string,
                domain: string,
            }
        }
    }
}

declare module 'net' {
    export interface Socket {
        encrypted?: boolean,
    }
}


const redirectMiddleware: GetServerSidePropsMiddleware = (next) => async (ctx) => {
    const store = ctx.req.reduxStore!;
    const { req } = ctx;

    const protocol = req.headers[':scheme'] ?? req.headers['x-forwarded-proto'] ?? (req.socket.encrypted ? 'https' : 'http');
    const host = req.headers[':authority'] ?? req.headers.host;
    const path = req.headers[':pathname'] ?? req.url;

    const url = new URL(`${protocol}://${host}${path}`);

    if (url.hostname !== 'localhost' && url.hostname !== '127.0.0.1' && protocol === 'http') {
        url.protocol = 'https';
        return {
            redirect: { permanent: false, destination: url.toString() },
        };
    }

    if (url.hostname === 'localhost') {
        req.state = req.state ?? {};
        req.state.site = {
            siteId: url.pathname.split('/')[1],
            domain: url.hostname,
        }
    }

    console.log('redirect middleware', url);

    return await next(ctx);
}

export default redirectMiddleware;
