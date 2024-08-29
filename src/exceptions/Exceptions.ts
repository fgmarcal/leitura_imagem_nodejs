import { baseError, errorResponse } from "./types"

export class GenericCustomError extends Error{
    private errorCode:string
    private errorDescription:string
    private status:number

    constructor({errorCode, errorDescription, status}:baseError){
        super(errorDescription)
        Error.captureStackTrace(this, GenericCustomError)
        this.errorCode = errorCode
        this.errorDescription = errorDescription
        this.status = status
        Object.setPrototypeOf(this, GenericCustomError.prototype);
    }


    public getStatus():number{
        return this.status
    }

    public getErrorResponse():errorResponse{
        const response:errorResponse = {
            "error_code":this.errorCode,
            "error_description":this.errorDescription
        }
        console.error(this)
        return response;
    }
}

export class NotFoundException extends GenericCustomError{
    constructor({errorCode, errorDescription, status}:baseError){
        super({errorCode, errorDescription, status});
    }
}

export class InvalidDataException extends GenericCustomError{
    constructor({errorCode, errorDescription, status}:baseError){
        super({errorCode, errorDescription, status});
    }
}

export class InvalidTypeException extends GenericCustomError{
    constructor({errorCode, errorDescription, status}:baseError){
        super({errorCode, errorDescription, status});
    }
}

export class DuplicateDataException extends GenericCustomError{
    constructor({errorCode, errorDescription, status}:baseError){
        super({errorCode, errorDescription, status});
    }
}

export class AIErrorException extends GenericCustomError{
    constructor({errorCode, errorDescription, status}:baseError){
        super({errorCode, errorDescription, status});
    }
}