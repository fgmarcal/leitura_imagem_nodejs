import { Request, Response } from "express";
import { CustomerRepository } from "../../../repository/customer/customerRepository";
import { CustomerService } from "../../../domain/service/customer/CustomerService";
import { CustomerResponseDTO } from "../../../domain/dto/customer/customerResponseDTO";

export class CustomerController {

    async getCustomer(request:Request, response:Response){
        const customerRepository = new CustomerRepository();
        const customerService = new CustomerService(customerRepository);

        const { customer_code } = request.body;
        const { measure_type } = request.query;
        try {
            const result = customerService.getCustomer({
                customer_code: customer_code as string,
                measure_type: measure_type as string | undefined,
            });
            return response.status(200).json(result);
        } catch (error) {
            return response.status(500).json({message:"error"})
        }
    }
}