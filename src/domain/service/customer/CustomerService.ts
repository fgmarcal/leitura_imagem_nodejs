import { Customer } from "@prisma/client";
import { ICustomerService } from "./ICustomerService";
import { CustomerRepository } from "../../../repository/customer/customerRepository";
import { QueryParams } from "../../dto/params/queryParams";
import { InvalidTypeException, NotFoundException } from "../../../exceptions/Exceptions";

export class CustomerService implements ICustomerService{

    private customerRepository:CustomerRepository;

    constructor(customerRepository:CustomerRepository){
        this.customerRepository = customerRepository;
    }

    async getCustomer(params: QueryParams): Promise<Customer|null> {
        if(params.measure_type){
            const measureType = params.measure_type.toUpperCase();
            if (measureType !== 'WATER' && measureType !== 'GAS') {
                const error = {
                    errorCode:"INVALID_TYPE",
                    errorDescription:"Tipo de medição não permitida",
                    status:400
                }
                throw new InvalidTypeException(error);
            }
        }
        const result = await this.customerRepository.getCustomer(params);
        if(result === null) {
            const err = {
                errorCode:"MEASURES_NOT_FOUND",
                errorDescription:"Nenhuma leitura encontrada",
                status:404
            }
            throw new NotFoundException(err);
        }
        return result;
    }
}