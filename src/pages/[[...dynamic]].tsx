import type { FunctionComponent } from 'react';
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


const propTypes = {
    a: PropTypes.bool,
}

const defaultProps = {
    a: false,
}

type DynamicProps = InferProps<typeof propTypes>;

const Dynamic: FunctionComponent<DynamicProps> = ({ a }) => {
    const dispatch = useDispatch<AppDispatch>();
    const lastUpdate = useLastUpdate();
    const count = useExampleStateValue('count');
    const light = useExampleStateValue('light');

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
            <Converter/>
            <Pokemon/>
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

    return { props: { initialReduxState: reduxStore.getState(), a: Math.random() < 0.5 }}
}

const withMiddleware = applyMiddlewares(getServerSideProps, loggerMiddleware);

export { withMiddleware as getServerSideProps };
