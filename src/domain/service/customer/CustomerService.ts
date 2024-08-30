import { Customer } from "@prisma/client";
import { ICustomerService } from "./ICustomerService";
import { CustomerRepository } from "../../../repository/customer/customerRepository";
import { QueryParams } from "../../dto/params/queryParams";
import { InvalidDataException, InvalidTypeException, NotFoundException } from "../../../exceptions/Exceptions";
import { CUSTOMER_NOT_FOUND, INVALID_DATA, INVALID_TYPE } from "../../../exceptions/errorCodes";
import { CreateMeasureDTO } from "../../dto/measures/createMeasure";

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
        try {
            await this.customerRepository.createCustomer(code);
        } catch (error) {
            console.error(error)
            throw new InvalidDataException(INVALID_DATA)
        }
    }

    async updateCustomer(measure:CreateMeasureDTO): Promise<void>{
        try {
            await this.customerRepository.updateCustomer(measure);
        } catch (error) {
            console.error(error)
            throw new InvalidDataException(INVALID_DATA)
        }
    }
}