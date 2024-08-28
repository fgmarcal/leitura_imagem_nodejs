import { Measure } from "@prisma/client"
import { MeasureDTO } from "../../domain/dto/measures/createMeasure"
import { UpdateMeasureDTO } from "../../domain/dto/measures/updateMeasure"

export interface IMeasureRepository{
    
    register(dto:MeasureDTO):Promise<Measure>

    update(dto:UpdateMeasureDTO):Promise<void>

    find(id:string):Promise<Measure>

    findByDate(customer_code: string, date: Date):Promise<boolean>
}