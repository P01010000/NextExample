import PropTypes, { InferProps } from 'prop-types';
import { FunctionComponent, useMemo } from 'react';
import dynamic from 'next/dynamic';
import useDynamicScript from './useDynamicScript';
import LoadingComponent from './LoadingComponent';
import loadComponent from './loadComponent';

const propTypes = {
    system: PropTypes.shape({
        url: PropTypes.string.isRequired,
        scope: PropTypes.string.isRequired,
        module: PropTypes.string.isRequired
    }).isRequired,
}

export type DynamicModuleProps = InferProps<typeof propTypes> & { [k: string]: unknown };


const DynamicModule: FunctionComponent<DynamicModuleProps> = ({ system, ...props }) => {
    const { ready, failed } = useDynamicScript({
        url: system.url
    });

    // memoize component to avoid reload on prop changes
    const Component = useMemo(() => {
        if (!ready || failed) {
            return null;
        }

        return dynamic(loadComponent(system.scope, system.module), {
            loading: LoadingComponent
        });
    }, [system.module, system.scope, ready, failed]);

    if (!system) {
        return <h2>No system specified</h2>;
    }

    if (!ready) {
        return <LoadingComponent/>;
    }

    if (failed) {
        return <h2>Failed to load dynamic script: {system.url}</h2>;
    }

    return Component && <Component {...props} />
}

DynamicModule.propTypes = propTypes;
DynamicModule.displayName = 'DynamicModule';

export default DynamicModule;
