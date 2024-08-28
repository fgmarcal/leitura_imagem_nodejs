import { NextFunction, Request, Response } from "express";
import { CustomerRepository } from "../../../repository/customer/customerRepository";
import { CustomerService } from "../../../domain/service/customer/CustomerService";
import { MeasureType } from "../../../domain/dto/params/queryParams";

export class CustomerController {

    async getCustomer(request:Request, response:Response, next:NextFunction){
        const customerRepository = new CustomerRepository();
        const customerService = new CustomerService(customerRepository);

        const { customer_code } = request.params;
        const { measure_type } = request.query;
        try {
            const result = await customerService.getCustomer({
                customer_code: customer_code as string,
                measure_type: measure_type as MeasureType | undefined,
            });
            return response.status(200).json(result);
        } catch (err) {
            next(err)
        }
    }
}