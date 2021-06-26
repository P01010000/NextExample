import { performance } from 'perf_hooks';
import { v4 as uuidV4 } from 'uuid';

import type { GetServerSidePropsMiddleware } from '../utils/middleware';


const loggerMiddleware: GetServerSidePropsMiddleware = (next) => async (ctx) => {
    const start = performance.now();
    const requestId = uuidV4();
    try {
        ctx.res.setHeader('X-Request-Id', requestId);

        return await next(ctx);
    } catch (ex) {
        // e.g. error handling or custom logging;
        console.error('getServerSideProps errored', ctx.req.url, requestId, ex);
        // rethrow to let next handle error page
        throw ex;
    } finally {
        // e.g. custom request logging when self-hosting
        console.info('finished logger middleware', requestId, (performance.now() - start), ctx.res.statusCode);
    }
}

export default loggerMiddleware;
