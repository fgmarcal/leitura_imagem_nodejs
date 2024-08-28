import { NextFunction, Request, Response } from "express";
import { MeasureRepository } from "../../../repository/measure/measureRepository";
import { IGeminiService } from "../../../domain/service/geminiService/IGeminiService";
import { IMeasureRepository } from "../../../repository/measure/IMeasureRepository";
import { IImageService } from "../../../domain/service/imageService/IImageService";
import { ImageService } from "../../../domain/service/imageService/ImageService";
import { GeminiService } from "../../../domain/service/geminiService/Gemini";
import { IMeasureService } from "../../../domain/service/measure/IMeasureService";
import { MeasureService } from "../../../domain/service/measure/MeasureService";
import { UploadMeasureDTO } from "../../../domain/dto/measures/uploadMeasure";

export class MeasureController {
    
    async upload(request:Request, response:Response, next:NextFunction){
        const measureRepository:IMeasureRepository = new MeasureRepository()
        const geminiService:IGeminiService = new GeminiService()
        const imageService:IImageService = new ImageService()
        const measureService:IMeasureService = new MeasureService(measureRepository, geminiService, imageService);

        const requestBody:UploadMeasureDTO = request.body
        try {
            const result = await measureService.register(requestBody);
            return response.status(200).json(result);
        } catch (error) {
            next(error)
        }

    }

    async confirm(){
        
    }
}