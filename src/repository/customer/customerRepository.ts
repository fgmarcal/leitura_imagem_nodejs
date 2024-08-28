import { CreateCustomerDTO } from "../../domain/dto/customer/createCustomerDTO";
import { QueryParams } from "../../domain/dto/params/queryParams";
import { prisma } from "../../domain/service/prisma/prisma";
import { ICustomerRepository } from "./ICustomerRepository";
import { Customer } from "@prisma/client";


export class CustomerRepository implements ICustomerRepository{

    async register(customer: CreateCustomerDTO): Promise<void> {
        await prisma.customer.create({
            data: {
                customer_code: customer.customer_code,
                measures: {
                    create: customer.measures.map(measure => ({
                        measure_uuid: measure.measure_uuid,
                        measure_datetime: measure.measure_datetime,
                        measure_type: measure.measure_type,
                        measure_value:measure.measure_value,
                        has_confirmed: measure.has_confirmed,
                        image_url: measure.image_url,
                    })),
                },
            },
        });
        await prisma.$disconnect();
    }

    async getCustomer(params:QueryParams): Promise<Customer>{
        const customer = await prisma.customer.findUniqueOrThrow({
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
        return customer;
    }
    
}