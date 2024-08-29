import { Measure } from "@prisma/client"
import { UploadMeasureDTO } from "../../dto/measures/uploadMeasure"
import { UpdateMeasureRequestDTO } from "../../dto/measures/UpdateMeasureDTO"

export interface IMeasureService{
    
    register(dto:UploadMeasureDTO):Promise<Measure>
    confirm(dto:UpdateMeasureRequestDTO):Promise<void>

}