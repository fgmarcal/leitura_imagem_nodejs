export interface baseError {
    errorCode:string,
    errorDescription:string,
    status:number
}

export type errorResponse = {
    "error_code":string,
    "error_description":string
}
