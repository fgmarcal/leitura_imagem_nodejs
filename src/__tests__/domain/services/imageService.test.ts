
import { describe, it, expect, beforeEach, vi } from 'vitest';
import fs from "node:fs"
import { IImageService } from '../../../domain/service/imageService/IImageService';
import { ImageService } from '../../../domain/service/imageService/ImageService';

describe('ImageService', () => {
  let imageService: IImageService;
  const mockWriteFile = vi.spyOn(fs, 'writeFile');


  beforeEach(() => {
    imageService = new ImageService();
    mockWriteFile.mockClear();
  });

  it('should create an image file and return the file path', async () => {
    const mockBase64Image = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4';
    
    const fileName = await imageService.create(mockBase64Image);

    expect(fileName).toMatch(/\/img\/[a-f0-9\-]+\.png/);
  });

  it('should extract the correct file extension from base64 image', () => {
    const mockBase64Image = 'data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4';
    
    const extension = imageService.getExtension(mockBase64Image);

    expect(extension).toBe('jpeg');
  });

});
