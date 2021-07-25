import { FunctionComponent, useCallback, useState } from 'react';


const Converter: FunctionComponent = () => {
    const [isConverting, setIsConverting] = useState(false);
    const [progress, setProgress] = useState(0);


    const onClick = useCallback(() => {
        setProgress(0);
        setIsConverting(true);

        const stream = new EventSource('/api/sse');

        stream.addEventListener('progress', (ev) => {
            if (!(ev instanceof MessageEvent)) {
                return;
            }
            const data = Number.parseInt(ev.data, 10);
            setProgress(data);
            if (data >= 100) {
                stream.close();
                setTimeout(setIsConverting, 1000, false);
            }
        });

        stream.addEventListener('error', () => {
            stream.close();
            setIsConverting(false);
            alert('Whoops')
        });
    }, [setIsConverting]);

    return (
        <div>
            {isConverting ? (
                <div>Converting... {progress} %</div>
            ) : (
                <button onClick={onClick} style={{ backgroundColor: 'blue' }}>Convert</button>
            )}
        </div>
    )
}

export default Converter;
