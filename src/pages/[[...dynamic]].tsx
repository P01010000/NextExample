import { FunctionComponent, useCallback, useState } from 'react';
import type { GetServerSideProps } from 'next';

import PropTypes, { InferProps } from 'prop-types';
import { initializeStore, AppDispatch } from '../store';
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


const propTypes = {
    a: PropTypes.bool,
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

const Dynamic: FunctionComponent<DynamicProps> = ({ a }) => {
    const dispatch = useDispatch<AppDispatch>();
    const [system, setSystem] = useState(remote1);
    const lastUpdate = useLastUpdate();
    const count = useExampleStateValue('count');
    const light = useExampleStateValue('light');

    const switchRemote = useCallback(() => {
        setSystem(system.scope === remote1.scope ? remote2 : remote1);
    }, [system]);

    return (
        <div>
            <div>Hello {String(a)}</div>
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
    const reduxStore = initializeStore();
    const { dispatch } = reduxStore;

    dispatch(tick({ light: false, lastUpdate: Date.now() }));

    dispatch(pokemonApi.util.prefetch('getPokemonList', { offset: 0, limit: 151 }, {}));

    await new Promise<void>((resolve, reject) => {
        let listener = reduxStore.subscribe(() => {
            const getPokemonList = pokemonApi.endpoints.getPokemonList.select({ offset: 0, limit: 151 });
            const pokemonList = getPokemonList(reduxStore.getState());
            listener();
            if (pokemonList.status === QueryStatus.fulfilled) {
                resolve();
            } else if (pokemonList.status === QueryStatus.rejected) {
                reject(pokemonList.error);
            }
        });
    });

    return { props: { initialReduxState: reduxStore.getState(), a: Math.random() < 0.5 } }
}

const withMiddleware = applyMiddlewares(getServerSideProps, loggerMiddleware);

export { withMiddleware as getServerSideProps };
