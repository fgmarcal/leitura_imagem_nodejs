
import { ICustomerRepository } from "../../../repository/customer/ICustomerRepository";
import { IMeasureRepository } from "../../../repository/measure/IMeasureRepository";
import { IMeasureService } from "./IMeasureService";

export class MeasureService implements IMeasureService{

    private measureRepository:IMeasureRepository;

    private customerRepository:ICustomerRepository;
    
    constructor(measureRepository:IMeasureRepository, customerRepository:ICustomerRepository){
        this.measureRepository = measureRepository;
        this.customerRepository = customerRepository;
    }

}