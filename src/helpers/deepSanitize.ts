import sanitize from 'mongo-sanitize'

export function deepSanitize (value : string | string[]) : string {
    
    if(Array.isArray(value)){
        value.forEach(elm=>deepSanitize(elm));
    }

    if(typeof(value) === 'object' && value !== null){
        Object.values(value).forEach((elm) => {
            deepSanitize(elm);
        })
    }
    return sanitize(value).toString(); 
}