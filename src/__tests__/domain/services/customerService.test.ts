import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CustomerService } from '../../../domain/service/customer/CustomerService';
import { CustomerRepository } from '../../../repository/customer/customerRepository';
import { MeasureType, QueryParams } from '../../../domain/dto/params/queryParams';

import { CUSTOMER_NOT_FOUND, INVALID_TYPE } from '../../../exceptions/errorCodes';
import { Customer } from '@prisma/client';
import { ICustomerService } from '../../../domain/service/customer/ICustomerService';
import { CreateMeasureDTO } from '../../../domain/dto/measures/createMeasure';

describe('CustomerService', () => {
  let customerService: ICustomerService;
  let mockCustomerRepository: CustomerRepository;

  beforeEach(() => {
    mockCustomerRepository = {
      getCustomer: vi.fn(),
      createCustomer: vi.fn(),
      updateCustomer:vi.fn(),
    } as unknown as CustomerRepository;

    customerService = new CustomerService(mockCustomerRepository);
  });

  it('should get a customer successfully', async () => {
    const params: QueryParams = { customer_code:'CUST123', measure_type: 'WATER' };
    const mockCustomer: Customer = {
      customer_code: 'CUST123',
    };

    vi.spyOn(mockCustomerRepository, 'getCustomer').mockResolvedValue(mockCustomer);

    const result = await customerService.getCustomer(params);

    expect(result).toEqual(mockCustomer);
    expect(mockCustomerRepository.getCustomer).toHaveBeenCalledWith(params);
  });

  it('should throw InvalidTypeException when measure_type is invalid', async () => {
    const customer_code = 'COD123'
    const measure_type = 'força' as MeasureType

    await expect(customerService.getCustomer({customer_code, measure_type})).rejects.toMatchObject({
      message: INVALID_TYPE.errorDescription,
      status: INVALID_TYPE.status
    });

    expect(mockCustomerRepository.getCustomer).not.toHaveBeenCalled();
  });

  it('should throw NotFoundException when no customer is found', async () => {
    const params: QueryParams = { customer_code:'',measure_type: 'WATER' };

    vi.spyOn(mockCustomerRepository, 'getCustomer').mockResolvedValue(null);

    await expect(customerService.getCustomer(params)).rejects.toMatchObject({
      message: CUSTOMER_NOT_FOUND.errorDescription,
      status: CUSTOMER_NOT_FOUND.status
    });

    expect(mockCustomerRepository.getCustomer).toHaveBeenCalledWith(params);
  });

  it('should create a customer successfully', async () => {
    const customerCode = 'CUST123';

    await customerService.createCustomer(customerCode);

    expect(mockCustomerRepository.createCustomer).toHaveBeenCalledWith(customerCode);
  });

  it('should update a customer successfully', async () => {
    const customerCode = 'CUST123';

    await customerService.createCustomer(customerCode);

    const measure: CreateMeasureDTO = {
      customer_code: 'CUST123',
      measure_datetime: new Date(),
      measure_type: 'WATER',
      measure_value: 70,
      has_confirmed: true,
      image_url: 'img/image.png',
    };
  
    await customerService.updateCustomer(measure);
  
    expect(mockCustomerRepository.updateCustomer).toHaveBeenCalledWith(measure);
  });

});
