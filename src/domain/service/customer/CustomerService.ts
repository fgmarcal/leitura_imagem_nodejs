import { Customer } from "@prisma/client";
import { ICustomerService } from "./ICustomerService";
import { CustomerRepository } from "../../../repository/customer/customerRepository";
import { QueryParams } from "../../dto/params/queryParams";
import { InvalidTypeException, NotFoundException } from "../../../exceptions/Exceptions";
import { CUSTOMER_NOT_FOUND, INVALID_TYPE } from "../../../exceptions/errorCodes";

export class CustomerService implements ICustomerService{

    private customerRepository:CustomerRepository;

    constructor(customerRepository:CustomerRepository){
        this.customerRepository = customerRepository;
    }

    async getCustomer(params: QueryParams): Promise<Customer|null> {
        if(params.measure_type){
            const measureType = params.measure_type.toUpperCase();
            if (measureType !== 'WATER' && measureType !== 'GAS') {
                throw new InvalidTypeException(INVALID_TYPE);
            }
        }
        const result = await this.customerRepository.getCustomer(params);
        if(result === null) {
            throw new NotFoundException(CUSTOMER_NOT_FOUND);
        }
        return result;
    }

    async createCustomer(code:string): Promise<void>{
        await this.customerRepository.createCustomer(code);
    }
}