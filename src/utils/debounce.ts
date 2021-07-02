
const debounce = (callback: Function, ms: number) => {
    let timeout: ReturnType<typeof setTimeout>;
    return (...args: unknown[]) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            callback(...args);
        }, ms)
    } 
}

export default debounce;
