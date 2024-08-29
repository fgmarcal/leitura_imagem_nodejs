import { NextFunction, Request, Response } from "express";
import { MeasureRepository } from "../../../repository/measure/measureRepository";
import { IMeasureRepository } from "../../../repository/measure/IMeasureRepository";
import { IMeasureService } from "../../../domain/service/measure/IMeasureService";
import { MeasureService } from "../../../domain/service/measure/MeasureService";
import { UploadMeasureDTO } from "../../../domain/dto/measures/uploadMeasure";
import { ICustomerRepository } from "../../../repository/customer/ICustomerRepository";
import { CustomerRepository } from "../../../repository/customer/customerRepository";
import { UpdateMeasureRequestDTO } from "../../../domain/dto/measures/UpdateMeasureDTO";

export class MeasureController {
    
    async upload(request:Request, response:Response, next:NextFunction){
        const measureRepository:IMeasureRepository = new MeasureRepository()
        const customerRepository:ICustomerRepository = new CustomerRepository()
        const measureService:IMeasureService = new MeasureService(measureRepository, customerRepository);

        const requestBody:UploadMeasureDTO = request.body
        try {
            const result = await measureService.register(requestBody);
            return response.status(200).json(result);
        } catch (error) {
            next(error)
        }

    }

    async confirm(request:Request, response:Response, next:NextFunction){
        const measureRepository:IMeasureRepository = new MeasureRepository()
        const customerRepository:ICustomerRepository = new CustomerRepository()
        const measureService:IMeasureService = new MeasureService(measureRepository, customerRepository);

        const requestBody:UpdateMeasureRequestDTO = request.body;

        try {
            await measureService.confirm(requestBody);
            return response.status(200).json({"success":true})
        } catch (error) {
            next(error)
        }
        
    }
}