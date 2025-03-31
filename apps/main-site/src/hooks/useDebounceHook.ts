import { useEffect } from "react";

interface Props {
    value: string;
    callback: (val: string) => void;
    interval: number;
}

export default function useDebounce({ value, callback, interval }: Props) {
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            callback(value); 
        }, interval);

        return () => {
            clearTimeout(timeoutId);
        };
    }, [value]); // Only depend on `value`
}
