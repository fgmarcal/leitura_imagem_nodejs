import { Measure } from '@prisma/client';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { UpdateMeasureRequestDTO } from '../../../domain/dto/measures/UpdateMeasureDTO';
import { IMeasureRepository } from '../../../repository/measure/IMeasureRepository';
import { IImageService } from '../../../domain/service/imageService/IImageService';
import { IGeminiService } from '../../../domain/service/geminiService/IGeminiService';
import { UploadMeasureDTO } from '../../../domain/dto/measures/uploadMeasure';
import { ICustomerService } from '../../../domain/service/customer/ICustomerService';
import { IMeasureService } from '../../../domain/service/measure/IMeasureService';
import { ICustomerRepository } from '../../../repository/customer/ICustomerRepository';
import { MeasureService } from '../../../domain/service/measure/MeasureService';
import { CONFIRMATION_DUPLICATE, MEASURE_NOT_FOUND } from '../../../exceptions/errorCodes';
import { prisma } from '../../../domain/service/prisma/prisma';



describe('MeasureService', () => {
  let measureService: IMeasureService;
  let mockMeasureRepository: IMeasureRepository;
  let mockGeminiService: IGeminiService;
  let mockImageService: IImageService;
  let mockCustomerService: ICustomerService;
  let mockCustomerRepository: ICustomerRepository;

  beforeEach(async () => {

    mockMeasureRepository = {
        findByDate: vi.fn().mockResolvedValue(false),
        register: vi.fn().mockResolvedValue({} as any),
        find: vi.fn(),
        update: vi.fn()
    } as unknown as IMeasureRepository;

    mockGeminiService = {
        consultWithAi: vi.fn().mockResolvedValue("12345")
      } as unknown as IGeminiService;

    mockImageService = {
      getExtension: vi.fn(),
      create: vi.fn().mockResolvedValue("/img/uuid.png")
    } as unknown as IImageService;

    mockCustomerService = {
      createCustomer: vi.fn()
  } as unknown as ICustomerService;

  mockCustomerRepository = {
    createCustomer: vi.fn() 
} as unknown as ICustomerRepository;


    measureService = new MeasureService(mockMeasureRepository, mockCustomerRepository);

    (measureService as any).validateFileWithAI = vi.fn().mockResolvedValue("12345");
    
    vi.clearAllMocks();

  });

  afterEach(async () => {

    await prisma.measure.deleteMany({});
    await prisma.customer.deleteMany({});
  });



  it('should register a new measure successfully', async () => {
    const dto: UploadMeasureDTO = {
        customer_code: 'CUST1230',
        image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4',
        measure_datetime: new Date('2024-08-01T10:00:00Z'),
        measure_type: 'WATER'
    };

    vi.spyOn(mockMeasureRepository, 'findByDate').mockResolvedValue(false);

    vi.spyOn(mockMeasureRepository, 'register').mockResolvedValue({} as any);

    const result = await measureService.register(dto);

    expect(result).toBeDefined();
    expect(mockMeasureRepository.register).toHaveBeenCalledTimes(1);
    expect(mockMeasureRepository.register).toHaveBeenCalledWith(expect.anything());
});

  it('should confirm a measure successfully', async () => {
    const dto: UpdateMeasureRequestDTO = {
      measure_uuid: 'UUID120',
      confirmed_value: 150
    };

    const existingMeasure: Measure = {
      measure_uuid: 'UUID120',
      measure_datetime: new Date(),
      measure_type: 'WATER',
      measure_value: 100,
      has_confirmed: false,
      image_url: 'img/image.png',
      customer_code: 'C1230',
    };

    vi.spyOn(mockMeasureRepository, 'find').mockResolvedValue(existingMeasure);
    vi.spyOn(measureService as any, 'isValidBodyRequestToUpdate').mockReturnValue(true);
    vi.spyOn(mockMeasureRepository, 'update').mockResolvedValue(undefined);

    await measureService.confirm(dto);

    expect(mockMeasureRepository.find).toHaveBeenCalledWith(dto.measure_uuid);
    expect(mockMeasureRepository.update).toHaveBeenCalledWith(dto);
  });

  it('should throw NotFoundException when the measure to confirm is not found', async () => {
    const dto: UpdateMeasureRequestDTO = {
      measure_uuid: 'UUID123',
      confirmed_value: 150
    };

    vi.spyOn(mockMeasureRepository, 'find').mockResolvedValue(null as unknown as Measure);

    await expect(measureService.confirm(dto)).rejects.toMatchObject({
      message: MEASURE_NOT_FOUND.errorDescription,
      status: MEASURE_NOT_FOUND.status
    });
  });

  it('should throw DuplicateDataException when the measure has already been confirmed', async () => {
    const dto: UpdateMeasureRequestDTO = {
      measure_uuid: 'UUID123',
      confirmed_value: 150
    };

    const existingMeasure: Measure = {
      measure_uuid: 'UUID123',
      measure_datetime: new Date(),
      measure_type: 'WATER',
      measure_value: 100,
      has_confirmed: true,
      image_url: 'img/image.png',
      customer_code: 'C123'
    };

    vi.spyOn(mockMeasureRepository, 'find').mockResolvedValue(existingMeasure);

    await expect(measureService.confirm(dto)).rejects.toMatchObject({
        message: CONFIRMATION_DUPLICATE.errorDescription,
        status: CONFIRMATION_DUPLICATE.status
        });
    });

});
