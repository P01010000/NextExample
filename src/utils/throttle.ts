
const throttle = (callback: Function, ms: number) => {
    let timeout: ReturnType<typeof setTimeout>;
    let timestamp = Date.now() - ms - 1;
    return (...args: unknown[]) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            callback(...args);
            timestamp = Date.now();
        }, ms - (Date.now() - timestamp))
    } 
}

export default throttle;
