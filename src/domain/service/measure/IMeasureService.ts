import { Measure } from "@prisma/client"
import { UploadMeasureDTO } from "../../dto/measures/uploadMeasure"
import { UpdateMeasureDTO } from "../../dto/measures/updateMeasure"

export interface IMeasureService{
    
    register(dto:UploadMeasureDTO):Promise<Measure>
    confirm(dto:UpdateMeasureDTO):Promise<void>

}