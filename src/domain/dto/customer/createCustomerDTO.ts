import { LoadMeasure } from "../measures/loadMeasure";

export interface CreateCustomerDTO{
    customer_code:string,
    measures:LoadMeasure[]
}