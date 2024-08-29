import { Request, Response, NextFunction } from 'express';
import { describe, it, expect, vi } from 'vitest';
import { GenericCustomError } from '../../exceptions/Exceptions';
import { errorHandler } from '../../middleware/ErrorHandler';

describe('errorHandler Middleware', () => {
    it('should handle GenericCustomError and return correct status and response', () => {

        const req = {} as Request;
        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        } as unknown as Response;
        const next = vi.fn() as NextFunction;


        const error = new GenericCustomError({
            errorCode: 'E001',
            errorDescription: 'teste de erro',
            status: 400
        });


        errorHandler(error, req, res, next);


        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error_code: 'E001',
            error_description: 'teste de erro'
        });
    });

    it('should handle non-GenericCustomError and return 500 status with generic response', () => {
        const req = {} as Request;
        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        } as unknown as Response;
        const next = vi.fn() as NextFunction;

        const error = new Error('Some generic error');

        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

        errorHandler(error, req, res, next);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            error_code: 'INTERNAL_SERVER_ERROR',
            error_description: 'An unexpected error occurred'
        });

        expect(consoleSpy).toHaveBeenCalledWith(error);

        consoleSpy.mockRestore();
    });
});
