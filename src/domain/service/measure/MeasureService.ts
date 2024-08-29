
import { Measure } from "@prisma/client";
import { IMeasureRepository } from "../../../repository/measure/IMeasureRepository";
import { MeasureDTO } from "../../dto/measures/createMeasure";
import { IMeasureService } from "./IMeasureService";
import { IGeminiService } from "../geminiService/IGeminiService";
import { AIErrorException, DuplicateDataException, InvalidDataException, NotFoundException } from "../../../exceptions/Exceptions";
import { UploadMeasureDTO } from "../../dto/measures/uploadMeasure";
import { IImageService } from "../imageService/IImageService";
import { AI_ERROR, CONFIRMATION_DUPLICATE, DOUBLE_REPORT, INVALID_DATA, MEASURE_NOT_FOUND } from "../../../exceptions/errorCodes";
import { GeminiService } from "../geminiService/Gemini";
import { ImageService } from "../imageService/ImageService";
import { ICustomerService } from "../customer/ICustomerService";
import { CustomerService } from "../customer/CustomerService";
import { ICustomerRepository } from "../../../repository/customer/ICustomerRepository";
import { UpdateMeasureRequestDTO } from "../../dto/measures/UpdateMeasureDTO";

export class MeasureService implements IMeasureService{

    private measureRepository:IMeasureRepository;

    private geminiService:IGeminiService

    private imageService:IImageService

    private customerService:ICustomerService
    
    constructor(measureRepository:IMeasureRepository, customerRepository:ICustomerRepository){
        this.measureRepository = measureRepository;
        this.geminiService = new GeminiService();
        this.imageService = new ImageService()
        this.customerService = new CustomerService(customerRepository);
    }

    async register(dto: UploadMeasureDTO): Promise<Measure> {
        const createMeasure:MeasureDTO = this.measureBoilerPlate();

        if(!this.isValidBodyRequestToRegister(dto)){
            throw new InvalidDataException(INVALID_DATA)
        }
        const getImgExtension = this.imageService.getExtension(dto.image)
        const imageURL = await this.imageService.create(dto.image)

        const aiValidation = await this.validateFileWithAI(imageURL, getImgExtension);
        createMeasure.measure_value = this.validateMeasureValue(aiValidation)

        const measureExists = await this.measureRepository.findByDate(dto.customer_code,dto.measure_datetime)
        if(measureExists){
            throw new DuplicateDataException(DOUBLE_REPORT)
        }
        createMeasure.measure_datetime = new Date(dto.measure_datetime)
        createMeasure.image_url = imageURL;
        createMeasure.measure_type = dto.measure_type
        createMeasure.customer_code = dto.customer_code

        await this.customerService.createCustomer(dto.customer_code)
        
        return await this.measureRepository.register(createMeasure)
    }

    async confirm(dto: UpdateMeasureRequestDTO): Promise<void> {
        const validateMeasure = await this.measureRepository.find(dto.measure_uuid);
        if(!this.isValidBodyRequestToUpdate(dto)){
            throw new InvalidDataException(INVALID_DATA)
        }

        if(!validateMeasure){
            throw new NotFoundException(MEASURE_NOT_FOUND)
        }

        if(validateMeasure.has_confirmed){
            throw new DuplicateDataException(CONFIRMATION_DUPLICATE)
        }

        await this.measureRepository.update(dto);
    }

    private async validateFileWithAI(file: string, extension:string): Promise<string> {
        const result:string|null = await this.geminiService.consultWithAi(file, extension)
        if(typeof result === 'string' && result !== null){
            return result;
        }
        throw new AIErrorException(AI_ERROR);
    }

    private isValidBodyRequestToRegister(dto:UploadMeasureDTO):boolean{
        if(dto.customer_code && dto.image && dto.measure_datetime && dto.measure_type){
            return true
        }
        return false
    }

    private isValidBodyRequestToUpdate(dto:UpdateMeasureRequestDTO):boolean{
        if(dto.confirmed_value && dto.measure_uuid){
            return true;
        }
        return false;
    }

    private measureBoilerPlate():MeasureDTO{
        return {
            customer_code: "",
            measure_datetime: new Date(),
            measure_type: "",
            measure_value: 0,
            has_confirmed: false,
            image_url: ""
        }
    }

    private validateMeasureValue(aiResponse:string):number{
        try {
            return Number(aiResponse);
        } catch (error) {
            throw new InvalidDataException(INVALID_DATA)
        }
    }

}