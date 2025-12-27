import { useEffect, useState } from "react";

export const useDebounce=(delay:number, value:string)=>{
const [debounceValue, setDebounceValue]=useState(value);

    useEffect(()=>{
        const timeout = setTimeout(() => {
        setDebounceValue(value)    
        }, delay);
        return ()=>clearTimeout(timeout);
    },[value, delay])

return debounceValue;

}