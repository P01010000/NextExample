import type { GetServerSideProps } from 'next';
import type { FC } from 'react';
import redirectMiddleware from '../middlewares/redirectMiddleware';
import { applyMiddlewares } from '../utils/middleware';

const OpenSearchDescription: FC = () => null;

const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
    const protocol = req.headers[':scheme'] ?? req.headers['x-forwarded-proto'] ?? (req.socket.encrypted ? 'https' : 'http');
    const host = (req.headers[':authority'] as string || undefined) ?? req.headers.host;

    if (res) {
        res.setHeader('Content-Type', 'text/xml');
        res.write(`<OpenSearchDescription xmlns="http://a9.com/-/spec/opensearch/1.1/">
       <ShortName>${host?.split(':')[0]}</ShortName>
       <Description>An emoji guide for your commit messages.</Description>
       <Tags>localhost</Tags>
       <Url type="text/html" template="${protocol}://${host}/?search={searchTerms}"/>
       </OpenSearchDescription>`);
        res.end();
    }
    return { props: {} };
}

const withMiddleware = applyMiddlewares(getServerSideProps, redirectMiddleware);

export { withMiddleware as getServerSideProps };

export default OpenSearchDescription;
