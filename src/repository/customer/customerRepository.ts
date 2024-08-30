import { CreateMeasureDTO } from "../../domain/dto/measures/createMeasure";
import { QueryParams } from "../../domain/dto/params/queryParams";
import { prisma } from "../../domain/service/prisma/prisma";
import { ICustomerRepository } from "./ICustomerRepository";
import { Customer } from "@prisma/client";


export class CustomerRepository implements ICustomerRepository{

    async createCustomer(code:string): Promise<void>{
        await prisma.customer.create({
            data:{
                customer_code:code
            }   
        });
    }

    async updateCustomer(measure: CreateMeasureDTO): Promise<void> {
        await prisma.customer.update({
            where: {
                customer_code: measure.customer_code,
            },
            data: {
                measures: {
                    create: {
                        measure_datetime: measure.measure_datetime,
                        measure_type: measure.measure_type,
                        measure_value: measure.measure_value,
                        has_confirmed: measure.has_confirmed,
                        image_url: measure.image_url,
                    }
                }
            }
        });
    }

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

        if(customer === null){
            return null;
        }
        return customer;
    }
    
}