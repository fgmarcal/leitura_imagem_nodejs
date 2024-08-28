import { Customer } from "@prisma/client";
import { ICustomerService } from "./ICustomerService";
import { CustomerRepository } from "../../../repository/customer/customerRepository";
import { QueryParams } from "../../dto/params/queryParams";

export class CustomerService implements ICustomerService{

    private customerRepository:CustomerRepository;

    constructor(customerRepository:CustomerRepository){
        this.customerRepository = customerRepository;
    }

    async getCustomer(params: QueryParams): Promise<Customer> {
        const result = this.customerRepository.getCustomer(params);
        return result;
    }
}