
import { Measure } from "@prisma/client";
import { ICustomerRepository } from "../../../repository/customer/ICustomerRepository";
import { IMeasureRepository } from "../../../repository/measure/IMeasureRepository";
import { MeasureDTO } from "../../dto/measures/createMeasure";
import { UpdateMeasureDTO } from "../../dto/measures/updateMeasure";
import { IMeasureService } from "./IMeasureService";
import { IGeminiService } from "../geminiService/IGeminiService";
import { DuplicateDataException, InvalidDataException } from "../../../exceptions/Exceptions";
import { UploadMeasureDTO } from "../../dto/measures/uploadMeasure";
import { IImageService } from "../imageService/IImageService";

export class MeasureService implements IMeasureService{

    private measureRepository:IMeasureRepository;

    private geminiService:IGeminiService

    private imageService:IImageService
    
    constructor(measureRepository:IMeasureRepository, geminiService:IGeminiService, imageService:IImageService){
        this.measureRepository = measureRepository;
        this.geminiService = geminiService;
        this.imageService = imageService
    }

    async register(dto: UploadMeasureDTO): Promise<Measure> {
        const createMeasure:MeasureDTO = {
            customer_code:"",
            has_confirmed:false,
            image_url:"",
            measure_datetime:new Date(),
            measure_type:"",
            measure_value:-2
        }
        if(!this.isValidBodyRequest(dto)){
            const INVALID_DATA = {
                errorCode:"INVALID_DATA",
                errorDescription:"Há campos inválidos na requisição",
                status:400
            }
            throw new InvalidDataException(INVALID_DATA)
        }
        const aiValidation = await this.validateFileWithAI(dto.image);
        createMeasure.customer_code = dto.customer_code
        createMeasure.measure_type = dto.measure_type
        createMeasure.measure_value = aiValidation

        const dateValidation = await this.measureRepository.findByDate(dto.customer_code,dto.measure_datetime)
        if(!dateValidation){
            const DOUBLE_REPORT = {
                errorCode:"DOUBLE_REPORT",
                errorDescription:"Leitura do mês já realizada",
                status:409
            }
            throw new DuplicateDataException(DOUBLE_REPORT)
        }
        createMeasure.measure_datetime = dto.measure_datetime

        const createImageURL = await this.imageService.create(dto.image)
        createMeasure.image_url = createImageURL
        
        return await this.measureRepository.register(createMeasure)
    }



    confirm(dto: UpdateMeasureDTO): Promise<void> {
        throw new Error("Method not implemented.");
    }

    private async validateFileWithAI(file: string): Promise<number> {
        const result:string = await this.geminiService.consultWithAi(file)
        if(result){
            return Number(result);
        }
        const error = {
            errorCode:"INVALID_DATA",
            errorDescription:"Erro ao consultar IA",
            status:400
        }
        throw new InvalidDataException(error);
    }

    private isValidBodyRequest(dto:UploadMeasureDTO):boolean{
        if(dto.customer_code && dto.image && dto.measure_datetime && dto.measure_type){
            return true
        }
        return false
    }

}