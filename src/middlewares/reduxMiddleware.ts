
import { initializeStore } from '../store';
import type { GetServerSidePropsMiddleware } from '../utils/middleware';

declare module 'http' {
    export interface IncomingMessage {
        reduxStore?: ReturnType<typeof initializeStore>,
    }
}

const reduxMiddleware: GetServerSidePropsMiddleware = (next) => async (ctx) => {
    const store = initializeStore();
    ctx.req.reduxStore = store;

    const serverSideProps = await next(ctx);

    if ('props' in serverSideProps) {
        return { props: { ...serverSideProps.props, initialReduxState: store.getState()}}
    }
    
    return serverSideProps;
}

export default reduxMiddleware;
