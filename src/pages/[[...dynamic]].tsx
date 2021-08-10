import React, { FunctionComponent, useCallback, useEffect, useState } from 'react';
import type { GetServerSideProps } from 'next';

import Head from 'next/head';
import Link from 'next/link';
import PropTypes, { InferProps } from 'prop-types';
import { AppDispatch } from '../store';
import { useExampleStateValue, useLastUpdate } from '../store/example/selector';
import { decrement, increment, reset, tick } from '../store/example/actions';
import { useDispatch } from 'react-redux';
import { applyMiddlewares } from '../utils/middleware';
import loggerMiddleware from '../middlewares/loggerMiddleware';
import Converter from '../components/converter/Converter';
import Pokemon from '../components/pokemon/Pokemon';
import DynamicModuleBoundary from '../components/dynamicModule/DynamicModuleBoundary';
import { pokemonApi } from '../services/pokemon/pokemon';
import { QueryStatus } from '@reduxjs/toolkit/dist/query';
import reduxMiddleware from '../middlewares/reduxMiddleware';
import authMiddleware from '../middlewares/authMiddleware';
import redirectMiddleware from '../middlewares/redirectMiddleware';
import Login from '../components/login/Login';
import { useUser } from '../store/user/selector';


const propTypes = {
    a: PropTypes.bool,
    siteId: PropTypes.string,
}

const defaultProps = {
    a: false,
}

type DynamicProps = InferProps<typeof propTypes>;

const remote1 = {
    url: '/example1/remoteEntry.js',
    module: './App',
    compatModule: './AppCompat',
    scope: 'example1',
};

const remote2 = {
    url: '/example2/remoteEntry.js',
    module: './App',
    compatModule: './AppCompat',
    scope: 'example2'
};

const Dynamic: FunctionComponent<DynamicProps> = ({ a, siteId }) => {
    const dispatch = useDispatch<AppDispatch>();
    const [system, setSystem] = useState(remote1);
    const user = useUser();
    const lastUpdate = useLastUpdate();
    const count = useExampleStateValue('count');
    const light = useExampleStateValue('light');

    const switchRemote = useCallback(() => {
        setSystem(system.scope === remote1.scope ? remote2 : remote1);
    }, [system]);

    useEffect(() => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('sw.js');
        }
        window.addEventListener('beforeinstallprompt', ev => {
            console.log('beforeinstall prompt');
            ev.preventDefault();
            setTimeout(async () => {
                ev.prompt();
                const choice = await ev.userChoice;
                console.log('choice', choice);
            }, 1000);
        });
    }, []);

    return (
        <div>
            <Head>
                <link rel="manifest" href="/manifest.json"/>
                <link rel="search" type="application/opensearchdescription+xml" href="/opensearchdescription.xml"/>
            </Head>
            <div style={{ position: 'sticky', top: 0, backgroundColor: '#0007', backdropFilter: 'blur(3px)', zIndex: 100 }}>Hello {user.isAuthenticated ? user.firstName : String(a)}</div>
            <Login siteId={siteId ?? undefined}/>
            <p>lastUpdate: {lastUpdate}</p>
            <p>count: {count}</p>
            <p>light: {String(light)}</p>
            <div>
                <button style={{ backgroundColor: 'green' }} onClick={() => dispatch(increment())}>Increment</button>
                <button style={{ backgroundColor: 'red' }} onClick={() => dispatch(decrement())}>Decrement</button>
                <button style={{ backgroundColor: 'gray' }} onClick={() => dispatch(reset())}>Reset</button>
            </div>
            <Converter />
            <Pokemon />
            <Link href={`/${siteId}/test`}>Test</Link>
            <div>
                <button onClick={switchRemote}>Switch Remote</button>
            </div>
            <DynamicModuleBoundary
                system={system}
                count={count}
            />
        </div>
    );
}

Dynamic.propTypes = propTypes;
Dynamic.defaultProps = defaultProps;
Dynamic.displayName = 'Dynamic';

export default Dynamic;



const getServerSideProps: GetServerSideProps<DynamicProps> = async ({ req, res }) => {
    const { dispatch, getState, subscribe } = req.reduxStore!;

    dispatch(tick({ light: false, lastUpdate: Date.now() }));

    dispatch(pokemonApi.util.prefetch('getPokemonList', { offset: 0, limit: 151 }, {}));

    await new Promise<void>((resolve, reject) => {
        let listener = subscribe(() => {
            const getPokemonList = pokemonApi.endpoints.getPokemonList.select({ offset: 0, limit: 151 });
            const pokemonList = getPokemonList(getState());
            listener();
            if (pokemonList.status === QueryStatus.fulfilled) {
                resolve();
            } else if (pokemonList.status === QueryStatus.rejected) {
                reject(pokemonList.error);
            }
        });
    });

    return { props: { a: Math.random() < 0.5, siteId: req.state?.site?.siteId || null } }
}

const withMiddleware = applyMiddlewares(getServerSideProps, loggerMiddleware, reduxMiddleware, redirectMiddleware, authMiddleware);

export { withMiddleware as getServerSideProps };
