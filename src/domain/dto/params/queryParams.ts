export interface QueryParams{
    customer_code: string;
    measure_type?: MeasureType;
}

export type MeasureType = 'WATER'|'GAS'