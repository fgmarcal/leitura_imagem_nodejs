import { Customer } from "@prisma/client";
import { QueryParams } from "../../domain/dto/params/queryParams";
import { CreateMeasureDTO } from "../../domain/dto/measures/createMeasure";


export interface ICustomerRepository{
    getCustomer(query:QueryParams):Promise<Customer|null>
    createCustomer(code:string): Promise<void>
    updateCustomer(measure: CreateMeasureDTO): Promise<void>
}