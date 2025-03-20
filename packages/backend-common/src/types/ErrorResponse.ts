export interface ErrorResponse<T = null>{
    success : boolean,
    message : string,
    data? : T,
}