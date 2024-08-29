import { describe, expect, it, vi } from 'vitest';
import { 
    GenericCustomError, 
    NotFoundException, 
    InvalidDataException, 
    InvalidTypeException, 
    DuplicateDataException, 
    AIErrorException,

} from '../../exceptions/Exceptions'
import { baseError, errorResponse } from '../../exceptions/types';


describe('Custom Error Classes', () => {

    const baseErrorData: baseError = {
        errorCode: 'E001',
        errorDescription: 'This is a test error',
        status: 400,
    };

    describe('GenericCustomError', () => {
        it('should correctly initialize and return status', () => {
            const error = new GenericCustomError(baseErrorData);

            expect(error.getStatus()).toBe(400);
            expect(error.message).toBe(baseErrorData.errorDescription);
        });

        it('should return the correct error response', () => {
            const error = new GenericCustomError(baseErrorData);
            const expectedResponse: errorResponse = {
                error_code: 'E001',
                error_description: 'This is a test error'
            };

            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
            expect(error.getErrorResponse()).toEqual(expectedResponse);
            expect(consoleSpy).toHaveBeenCalledWith(error);
            consoleSpy.mockRestore();
        });
    });

    describe('NotFoundException', () => {
        it('should extend GenericCustomError and return correct values', () => {
            const error = new NotFoundException(baseErrorData);

            expect(error.getStatus()).toBe(400);
            expect(error.message).toBe(baseErrorData.errorDescription);
            expect(error.getErrorResponse()).toEqual({
                error_code: 'E001',
                error_description: 'This is a test error'
            });
        });
    });

    describe('InvalidDataException', () => {
        it('should extend GenericCustomError and return correct values', () => {
            const error = new InvalidDataException(baseErrorData);

            expect(error.getStatus()).toBe(400);
            expect(error.message).toBe(baseErrorData.errorDescription);
            expect(error.getErrorResponse()).toEqual({
                error_code: 'E001',
                error_description: 'This is a test error'
            });
        });
    });

    describe('InvalidTypeException', () => {
        it('should extend GenericCustomError and return correct values', () => {
            const error = new InvalidTypeException(baseErrorData);

            expect(error.getStatus()).toBe(400);
            expect(error.message).toBe(baseErrorData.errorDescription);
            expect(error.getErrorResponse()).toEqual({
                error_code: 'E001',
                error_description: 'This is a test error'
            });
        });
    });

    describe('DuplicateDataException', () => {
        it('should extend GenericCustomError and return correct values', () => {
            const error = new DuplicateDataException(baseErrorData);

            expect(error.getStatus()).toBe(400);
            expect(error.message).toBe(baseErrorData.errorDescription);
            expect(error.getErrorResponse()).toEqual({
                error_code: 'E001',
                error_description: 'This is a test error'
            });
        });
    });

    describe('AIErrorException', () => {
        it('should extend GenericCustomError and return correct values', () => {
            const error = new AIErrorException(baseErrorData);

            expect(error.getStatus()).toBe(400);
            expect(error.message).toBe(baseErrorData.errorDescription);
            expect(error.getErrorResponse()).toEqual({
                error_code: 'E001',
                error_description: 'This is a test error'
            });
        });
    });
});
