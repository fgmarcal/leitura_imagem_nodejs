import { Request, Response, NextFunction } from 'express';
import { GenericCustomError } from '../exceptions/Exceptions';


export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction): void {
    if (err instanceof GenericCustomError) {
        const customError = err as GenericCustomError;
        res.status(customError.getStatus()).json(customError.getErrorResponse());
    } else {
        console.error(err); 
        res.status(500).json({
            error_code: 'INTERNAL_SERVER_ERROR',
            error_description: 'An unexpected error occurred'
        });
    }
}
