import { useEffect, useState } from 'react';

type DynamicScriptArguments = {
    url?: string
}

type DynamicScriptType = {
    ready: boolean,
    failed: boolean,
}

const useDynamicScript = (args: DynamicScriptArguments): DynamicScriptType => {
    const [ready, setReady] = useState(false);
    const [failed, setFailed] = useState(false);

    useEffect(() => {
        if (!args.url) {
            return;
        }

        const element = document.createElement("script");

        element.src = args.url;
        element.type = "text/javascript";
        element.async = true;

        setReady(false);
        setFailed(false);

        element.onload = () => {
            console.debug(`Dynamic Script Loaded: ${args.url}`);
            setReady(true);
        };

        element.onerror = () => {
            console.debug(`Dynamic Script Error: ${args.url}`);
            setReady(false);
            setFailed(true);
        };

        document.head.appendChild(element);

        return () => {
            console.debug(`Dynamic Script Removed: ${args.url}`);
            document.head.removeChild(element);
        };
    }, [args.url]);

    return {
        ready,
        failed
    };
};

export default useDynamicScript;
