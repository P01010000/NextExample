import type { JwtPayload } from 'jsonwebtoken';
import type { GetServerSidePropsMiddleware } from '../utils/middleware';
import authHandler from '../handler/auth';
import { setUser } from '../store/user/actions';

declare module 'http' {
    export interface IncomingMessage {
        user?: JwtPayload,
    }
}

const authMiddleware: GetServerSidePropsMiddleware = (next) => async (ctx) => {
    const response = await authHandler(ctx);
    const store = ctx.req.reduxStore;

    if (response) {
        ctx.req.user = response.payload;

        store?.dispatch(setUser({
            personId: response.payload.sub!,
            firstName: response.payload.firstName,
            lastName: response.payload.lastName,
            groups: response.payload.groups,
            token: response.token,
        }));
    }

    return await next(ctx);
}

export default authMiddleware;
