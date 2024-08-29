import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CustomerService } from '../../../domain/service/customer/CustomerService';
import { Request, Response, NextFunction } from 'express';
import { NotFoundException } from '../../../exceptions/Exceptions';
import { CustomerController } from '../../../api/controller/customer/CustomerController';
import { CustomerRepository } from '../../../repository/customer/customerRepository';
import { CUSTOMER_NOT_FOUND } from '../../../exceptions/errorCodes';

describe('CustomerController', () => {
  let customerController: CustomerController;
  let mockCustomerService: CustomerService;
  let mockCustomerRepository: CustomerRepository;
  let req: Request;
  let res: Response;
  let next: NextFunction;

  beforeEach(() => {
    mockCustomerRepository = {} as CustomerRepository;
    mockCustomerService = new CustomerService(mockCustomerRepository);
    customerController = new CustomerController();

    req = {
      params: {},
      query: {}
    } as unknown as Request;

    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    } as unknown as Response;

    next = vi.fn();
  });

  it('should return customer data successfully', async () => {
    req.params.customer_code = 'CUST123';
    req.query.measure_type = 'WATER';

    const customerData = {
      customer_code: 'CUST123',
      customer_name: 'John Doe',
      measure_type: 'WATER',
      measure_value: 100
    };

    vi.spyOn(CustomerService.prototype, 'getCustomer').mockResolvedValue(customerData);

    await customerController.getCustomer(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(customerData);
  });

  it('should call next with NotFoundException if customer is not found', async () => {
    req.params.customer_code = 'CUST123';
    req.query.measure_type = 'WATER';

    const error = new NotFoundException(CUSTOMER_NOT_FOUND);
    vi.spyOn(CustomerService.prototype, 'getCustomer').mockRejectedValue(error);

    await customerController.getCustomer(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  it('should call next with an error if an unexpected error occurs', async () => {
    req.params.customer_code = 'CUST123';
    req.query.measure_type = 'WATER';

    const error = new Error('Unexpected error');
    vi.spyOn(CustomerService.prototype, 'getCustomer').mockRejectedValue(error);

    await customerController.getCustomer(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  it('should handle requests without measure_type query param', async () => {
    req.params.customer_code = 'CUST123';

    const customerData = {
      customer_code: 'CUST123',
      customer_name: 'John Doe',
      measure_type: 'WATER',
      measure_value: 100
    };

    vi.spyOn(CustomerService.prototype, 'getCustomer').mockResolvedValue(customerData);

    await customerController.getCustomer(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(customerData);
  });
});
