import { MeasureType } from "../params/queryParams";

export interface UploadMeasureDTO{
    image:string,
    customer_code:string,
    measure_datetime:Date,
    measure_type:MeasureType
}