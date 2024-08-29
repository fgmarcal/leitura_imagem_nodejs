import { Measure } from "@prisma/client";
import { MeasureDTO } from "../../domain/dto/measures/createMeasure";
import { UpdateMeasureRequestDTO } from "../../domain/dto/measures/UpdateMeasureDTO";
import { prisma } from "../../domain/service/prisma/prisma";
import { IMeasureRepository } from "./IMeasureRepository";
import { UpdateMeasureDTO } from "../../domain/dto/measures/updateMeasure";

export class MeasureRepository implements IMeasureRepository{

    async find(id: string): Promise<Measure> {
        const result = await prisma.measure.findUnique({
            where:{measure_uuid:id}
        })
        await prisma.$disconnect();
        
        return result as Measure 
    }

    async findByDate(customer_code: string, date: Date): Promise<boolean> {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        const startOfMonth = new Date(dateObj.getFullYear(), dateObj.getMonth(), 1);
        const endOfMonth = new Date(dateObj.getFullYear(), dateObj.getMonth() + 1, 0, 23, 59, 59, 999);
    
        const result = await prisma.measure.findFirst({
            where: {
                customer_code: customer_code,
                measure_datetime: {
                    gte: startOfMonth,
                    lte: endOfMonth,
                },
            },
        });    
        return result !== null;
    }
    
    async register(dto:MeasureDTO): Promise<Measure> {
        const result = await prisma.measure.create({
            data:{
                customer:{connect:{customer_code:dto.customer_code}},
                measure_datetime: dto.measure_datetime,
                measure_type: dto.measure_type,
                measure_value: dto.measure_value,
                has_confirmed: dto.has_confirmed,
                image_url: dto.image_url,
            }
        })
        await prisma.$disconnect();
        return result;
    }


    async update(dto:UpdateMeasureRequestDTO): Promise<void> {
        const measure:UpdateMeasureDTO = {
            measure_value:dto.confirmed_value,
            has_confirmed:true
        }
        await prisma.measure.update({
            where:{measure_uuid:dto.measure_uuid},
            data:measure
        });
    }

}