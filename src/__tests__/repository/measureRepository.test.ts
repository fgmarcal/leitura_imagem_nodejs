import { describe, it, expect, vi } from 'vitest';

import { IMeasureRepository } from '../../repository/measure/IMeasureRepository';
import { MeasureRepository } from '../../repository/measure/measureRepository';
import { prisma } from '../../domain/service/prisma/prisma';
import { Measure } from '@prisma/client';



const measureRepo:IMeasureRepository = new MeasureRepository();

describe('MeasureRepository', () => {
  it('should return a measure when found', async () => {
    vi.spyOn(prisma.measure, 'findUnique').mockResolvedValue({ measure_uuid: '123', measure_value: 100 } as any);

    const result = await measureRepo.find('123');
    expect(result).toEqual({ measure_uuid: '123', measure_value: 100 });
  });

  it('should return null when no measure is found', async () => {
    vi.spyOn(prisma.measure, 'findUnique').mockResolvedValue(null);

    const result = await measureRepo.find('nonexistent-id');
    expect(result).toBeNull();
  });

  it('should return true if a measure exists for the given date', async () => {
    vi.spyOn(prisma.measure, 'findFirst').mockResolvedValue({} as any);

    const result = await measureRepo.findByDate('customer123', new Date('2024-08-01'));
    expect(result).toBe(true);
  });

  it('should return false if no measure exists for the given date', async () => {
    vi.spyOn(prisma.measure, 'findFirst').mockResolvedValue(null);

    const result = await measureRepo.findByDate('customer123', new Date('2024-08-01'));
    expect(result).toBe(false);
  });

  it('should create a new measure and return it', async () => {
    const newMeasure = {
      measure_uuid: '123',
      measure_value: 100,
      customer_code: 'customer123',
      measure_datetime: new Date(),
      measure_type: 'type',
      has_confirmed: false,
      image_url: 'img/image.jpg',
    };

    vi.spyOn(prisma.measure, 'create').mockResolvedValue(newMeasure as any);

    const result = await measureRepo.register({
      customer_code: 'customer123',
      measure_datetime: new Date(),
      measure_type: 'type',
      measure_value: 100,
      has_confirmed: false,
      image_url: 'img/image.jpg',
    });
    expect(result).toEqual(newMeasure);
  });

  it('should throw an error if the customer is not found', async () => {
    vi.spyOn(prisma.measure, 'create').mockRejectedValue(new Error('Customer not found'));

    await expect(measureRepo.register({
      customer_code: 'invalid-code',
      measure_datetime: new Date(),
      measure_type: 'type',
      measure_value: 100,
      has_confirmed: false,
      image_url: 'img/image.jpg',
    })).rejects.toThrow('Customer not found');
  });

  it('should update a measure', async () => {
    vi.spyOn(prisma.measure, 'update').mockResolvedValue({} as Measure);

    await measureRepo.update({
      measure_uuid: '123',
      confirmed_value: 150,
    });

    expect(prisma.measure.update).toHaveBeenCalledWith({
      where: { measure_uuid: '123' },
      data: { measure_value: 150, has_confirmed: true },
    });
  });

  it('should throw an error if the measure is not found', async () => {
    vi.spyOn(prisma.measure, 'update').mockRejectedValue(new Error('Measure not found'));

    await expect(measureRepo.update({
      measure_uuid: 'nonexistent-id',
      confirmed_value: 150,
    })).rejects.toThrow('Measure not found');
  });
});
