import { CreateCustomerDTO } from "../../domain/dto/customer/createCustomerDTO";
import { Customer } from "@prisma/client";
import { QueryParams } from "../../domain/dto/params/queryParams";


export interface ICustomerRepository{

    register(customer:CreateCustomerDTO):Promise<void>
    getCustomer(query:QueryParams):Promise<Customer>
}