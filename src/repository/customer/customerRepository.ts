import { CreateCustomerDTO } from "../../domain/dto/customer/createCustomerDTO";
import { QueryParams } from "../../domain/dto/params/queryParams";
import { prisma } from "../../domain/service/prisma/prisma";
import { ICustomerRepository } from "./ICustomerRepository";
import { Customer } from "@prisma/client";


export class CustomerRepository implements ICustomerRepository{

    async getCustomer(params:QueryParams): Promise<Customer | null>{
        const customer = await prisma.customer.findUnique({
            where: {
                customer_code: params.customer_code,
            },
            include: {
                measures: params.measure_type ? {
                    where: {
                        measure_type: params.measure_type,
                    }
                } : true, 
            },
        });

        prisma.$disconnect();
        if(customer === null){
            return null;
        }
        return customer;
    }
    
}