import { Measure } from "@prisma/client";
import { MeasureDTO } from "../../domain/dto/measures/createMeasure";
import { UpdateMeasureDTO } from "../../domain/dto/measures/updateMeasure";
import { prisma } from "../../domain/service/prisma/prisma";
import { IMeasureRepository } from "./IMeasureRepository";

export class MeasureRepository implements IMeasureRepository{

    async find(id: string): Promise<Measure> {
        const result = await prisma.measure.findUnique({
            where:{measure_uuid:id}
        })
        await prisma.$disconnect();
        
        return result as Measure 
    }
    
    async register(dto:MeasureDTO): Promise<void> {
        await prisma.measure.create({
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
    }


    async update(dto:UpdateMeasureDTO): Promise<void> {
        const updateData:any = {
            confirmed_value:dto.confirmed_value
        }
        await prisma.measure.update({
            where:{measure_uuid:dto.measure_uuid},
            data:updateData
        });
    }

}