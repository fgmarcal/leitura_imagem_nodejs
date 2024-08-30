import { describe, it, expect, vi } from 'vitest';
import { prisma } from '../../domain/service/prisma/prisma';
import { MeasureType, QueryParams } from '../../domain/dto/params/queryParams';
import { ICustomerRepository } from '../../repository/customer/ICustomerRepository';
import { CustomerRepository } from '../../repository/customer/customerRepository';
import { Customer, Measure } from '@prisma/client';
import { CreateMeasureDTO } from '../../domain/dto/measures/createMeasure';


vi.mock('../../domain/service/prisma/prisma', () => ({
    prisma: {
        customer: {
            create: vi.fn(),
            findUnique: vi.fn(),
            update:vi.fn(),
        },
    },
}));

const customerRepo:ICustomerRepository = new CustomerRepository();

describe('CustomerRepository', () => {
    it('should create a new customer', async () => {
        const code = 'customer123';
        await customerRepo.createCustomer(code);

        expect(prisma.customer.create).toHaveBeenCalledWith({
            data: { customer_code: code },
        });
    });

    it('should update a customer adding a new measure', async () => {
        const measure: CreateMeasureDTO = {
            customer_code: 'customer123',
            measure_datetime: new Date(),
            measure_type: 'WEIGHT',
            measure_value: 75,
            has_confirmed: true,
            image_url: 'img/image.png',
        };

        await customerRepo.updateCustomer(measure);
    
        expect(prisma.customer.update).toHaveBeenCalledWith({
            where: { customer_code: measure.customer_code },
            data: {
                measures: {
                    create: {
                        measure_datetime: measure.measure_datetime,
                        measure_type: measure.measure_type,
                        measure_value: measure.measure_value,
                        has_confirmed: measure.has_confirmed,
                        image_url: measure.image_url,
                    },
                },
            },
        });
    });



    it('should return a customer with measures', async () => {
        const queryParams = {
            customer_code: 'customer123',
            measure_type: 'WATER' as MeasureType,
        };
        const mockCustomer = {
            customer_code: 'customer123',
            measures: [{ measure_type: 'WATER' as MeasureType, measure_value: 100 }],
        };

        (prisma.customer.findUnique as any).mockResolvedValueOnce(mockCustomer as any);

        const result = await customerRepo.getCustomer(queryParams);

        expect(result).toEqual(mockCustomer);
        expect(prisma.customer.findUnique).toHaveBeenCalledWith({
            where: { customer_code: queryParams.customer_code },
            include: {
                measures: {
                    where: { measure_type: queryParams.measure_type },
                },
            },
        });
    });


    it('should return a customer without measures', async () => {
        const queryParams = {
            customer_code: 'customer123',
        };
        const mockCustomer: any = {
            customer_code: 'customer123',
            measures:[]
        };

        (prisma.customer.findUnique as any).mockResolvedValueOnce(mockCustomer);

        const result = await customerRepo.getCustomer(queryParams);

        expect(result).toEqual(mockCustomer);
        expect(prisma.customer.findUnique).toHaveBeenCalledWith({
            where: { customer_code: queryParams.customer_code },
            include: {
                measures:true
            },
        });
    });

    it('should return null if customer is not found', async () => {
        const queryParams = {
            customer_code: 'nonexistent',
        };

        (prisma.customer.findUnique as any).mockResolvedValueOnce(null);

        const result = await customerRepo.getCustomer(queryParams);

        expect(result).toBeNull();
        expect(prisma.customer.findUnique).toHaveBeenCalledWith({
            where: { customer_code: queryParams.customer_code },
            include: {
                measures:true
            },
        });
    });

    


});