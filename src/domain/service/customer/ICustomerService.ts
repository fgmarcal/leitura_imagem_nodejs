import { Customer } from "@prisma/client";
import { QueryParams } from "../../dto/params/queryParams";

export interface ICustomerService{

    getCustomer(params:QueryParams):Promise<Customer>
}