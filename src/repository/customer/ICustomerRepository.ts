import { CreateCustomerDTO } from "../../domain/dto/customer/createCustomerDTO";
import { Customer } from "@prisma/client";
import { QueryParams } from "../../domain/dto/params/queryParams";


export interface ICustomerRepository{
    getCustomer(query:QueryParams):Promise<Customer|null>
    createCustomer(code:string): Promise<void>
}