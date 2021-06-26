import '../styles/globals.css'
import type { AppProps } from 'next/app'
import type { FunctionComponent } from 'react';
import { Provider } from 'react-redux'
import { useStore } from '../store';

const App: FunctionComponent<AppProps> = ({ Component, pageProps }: AppProps) => {
    const store = useStore(pageProps.initialReduxState);

    return (
        <Provider store={store}>
            <Component {...pageProps} />
        </Provider>
    );
}
export default App;
