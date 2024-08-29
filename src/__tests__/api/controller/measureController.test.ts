import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MeasureService } from '../../../domain/service/measure/MeasureService';
import { Request, Response, NextFunction } from 'express';
import { UploadMeasureDTO } from '../../../domain/dto/measures/uploadMeasure';
import { UpdateMeasureRequestDTO } from '../../../domain/dto/measures/UpdateMeasureDTO';
import { NotFoundException } from '../../../exceptions/Exceptions';
import { MeasureController } from '../../../api/controller/measure/MeasureController';
import { MEASURE_NOT_FOUND } from '../../../exceptions/errorCodes';

describe('MeasureController', () => {
    let measureController: MeasureController;
    let req: Request;
    let res: Response;
    let next: NextFunction;

    beforeEach(() => {
        measureController = new MeasureController();

        req = {
        body: {}
        } as unknown as Request;

        res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn()
        } as unknown as Response;

        next = vi.fn();
    });

    describe('upload', () => {
        it('should successfully upload measure data', async () => {
        req.body = {
            image: 'base64image',
            customer_code: 'CUST123',
            measure_datetime: new Date('2023-08-29T12:00:00Z'),
            measure_type: 'WATER'
        } as UploadMeasureDTO;

        const mockResult = {
            measure_uuid: 'MEASURE123',
            customer_code: 'CUST123',
            measure_datetime: new Date('2023-08-29T12:00:00Z'),
            measure_type: 'WATER',
            measure_value: 100,
            has_confirmed: false,
            image_url: 'img/image.png'
        };

        vi.spyOn(MeasureService.prototype, 'register').mockResolvedValue(mockResult);

        await measureController.upload(req, res, next);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockResult);
        });

        it('should call next with an error if upload fails', async () => {
        req.body = {
            image: 'base64image',
            customer_code: 'CUST123',
            measure_datetime: new Date('2023-08-29T12:00:00Z'),
            measure_type: 'WATER'
        } as UploadMeasureDTO;

        const error = new Error('Upload failed');
        vi.spyOn(MeasureService.prototype, 'register').mockRejectedValue(error);

        await measureController.upload(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe('confirm', () => {
        it('should successfully confirm measure data', async () => {
        req.body = {
            measure_uuid: 'MEASURE123',
            confirmed_value: 150
        } as UpdateMeasureRequestDTO;

        vi.spyOn(MeasureService.prototype, 'confirm').mockResolvedValue();

        await measureController.confirm(req, res, next);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ success: true });
        });

        it('should call next with NotFoundException if measure not found', async () => {
        req.body = {
            measure_uuid: 'MEASURE123',
            confirmed_value: 150
        } as UpdateMeasureRequestDTO;

        const error = new NotFoundException(MEASURE_NOT_FOUND);
        vi.spyOn(MeasureService.prototype, 'confirm').mockRejectedValue(error);

        await measureController.confirm(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
        });

        it('should call next with an error if confirm fails', async () => {
        req.body = {
            measure_uuid: 'MEASURE123',
            confirmed_value: 150
        } as UpdateMeasureRequestDTO;

        const error = new Error('Confirmation failed');
        vi.spyOn(MeasureService.prototype, 'confirm').mockRejectedValue(error);

        await measureController.confirm(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
        });
    });
});
