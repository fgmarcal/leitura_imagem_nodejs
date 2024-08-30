import { Customer } from "@prisma/client";
import { QueryParams } from "../../dto/params/queryParams";
import { CreateMeasureDTO } from "../../dto/measures/createMeasure";

export interface ICustomerService{

    getCustomer(params:QueryParams):Promise<Customer|null>
    createCustomer(code:string): Promise<void>
    updateCustomer(measure:CreateMeasureDTO): Promise<void>
}