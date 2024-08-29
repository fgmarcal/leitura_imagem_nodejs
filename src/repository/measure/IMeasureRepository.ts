import { Measure } from "@prisma/client"
import { CreateMeasureDTO } from "../../domain/dto/measures/createMeasure"
import { UpdateMeasureRequestDTO } from "../../domain/dto/measures/UpdateMeasureDTO"

export interface IMeasureRepository{
    
    register(dto:CreateMeasureDTO):Promise<Measure>

    update(dto:UpdateMeasureRequestDTO):Promise<void>

    find(id:string):Promise<Measure>

    findByDate(customer_code: string, date: Date):Promise<boolean>
}