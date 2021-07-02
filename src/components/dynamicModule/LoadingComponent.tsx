import type { FunctionComponent } from 'react';

export type LoadingProps = {
    error?: Error | null;
    isLoading?: boolean;
    pastDelay?: boolean;
    retry?: () => void;
    timedOut?: boolean;
}

const LoadingComponent: FunctionComponent<LoadingProps> = ({ error }) => {
    if (error) {
        return <div><h1>Error</h1><p>{error}</p></div>
    }
    return <div>Loading</div>;
}

LoadingComponent.displayName = 'LoadingComponent';

export default LoadingComponent;
