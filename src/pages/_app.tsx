import '../styles/globals.css'
import type { AppProps } from 'next/app';
import Script from 'next/script';
import React, { FunctionComponent } from 'react';
import { Provider } from 'react-redux'
import 'abortcontroller-polyfill/dist/abortcontroller-polyfill-only';
import { useStore } from '../store';

globalThis.React = React;

const App: FunctionComponent<AppProps> = ({ Component, pageProps }: AppProps) => {
    const store = useStore(pageProps.initialReduxState);

    return (
        <>
            <Script src="https://chayns.space/77890-17410/example3/web/remoteEntry.js" strategy="beforeInteractive"/>
            <Provider store={store}>
                <Component {...pageProps} />
            </Provider>
        </>
    );
}
export default App;
