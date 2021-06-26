import type { GetServerSideProps } from 'next';

export type GetServerSidePropsMiddleware = <T extends { [key: string]: unknown; }>(next: GetServerSideProps<T>) => GetServerSideProps<T>;

/**
 * 
 * @param fn the function to apply middlewares to
 * @param middlewares the middlewares to apply
 * @returns the function wrapped with the middlewares
 */
export const applyMiddlewares = <T extends { [key: string]: unknown; }>(fn: GetServerSideProps<T>, ...middlewares: GetServerSidePropsMiddleware[]): GetServerSideProps<T> => {
    let res = fn;
    for (let i = middlewares.length - 1; i >= 0; i--) {
        res = middlewares[i](res);
    }
    return res;
}
