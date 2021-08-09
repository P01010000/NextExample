import type { AppProps } from 'next/app'
import type { FunctionComponent } from 'react';
import { Provider } from 'react-redux'
import 'abortcontroller-polyfill/dist/abortcontroller-polyfill-only';

import { useStore } from '../store';
import GlobalStyle from '../styles/globals';

const App: FunctionComponent<AppProps> = ({ Component, pageProps }: AppProps) => {
    const store = useStore(pageProps.initialReduxState);

    return (
        <Provider store={store}>
            <GlobalStyle/>
            <Component {...pageProps} />
        </Provider>
    );
}
export default App;
