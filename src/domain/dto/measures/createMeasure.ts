export interface CreateMeasureDTO {
    customer_code:string;
    measure_datetime: Date;
    measure_type: string;
    measure_value:number;
    has_confirmed: boolean;
    image_url: string;
}