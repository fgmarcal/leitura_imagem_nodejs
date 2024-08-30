import { describe, it, expect, vi, beforeEach } from 'vitest';

import path from 'node:path';
import fs from 'node:fs';
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import { IGeminiService } from '../../../domain/service/geminiService/IGeminiService';
import { GeminiService } from '../../../domain/service/geminiService/GeminiService';
import { imagePath } from '../../../domain/service/imageService/ImagePath';


vi.mock('dotenv', async (importOriginal) => {
    const actual:any = await importOriginal();
    return {
      ...actual,
      config: vi.fn(),
    };
  });


vi.mock('node:fs', async (importOriginal) => {
    const actual:any = await importOriginal();
    return {
      ...actual,
      promises: {
        readFile: vi.fn(),
      },
    };
  });

vi.mock('@google/generative-ai', async (importOriginal) => {
    const actual:any = await importOriginal();
    return {
      ...actual,
      GoogleGenerativeAI: vi.fn().mockImplementation(() => ({
        getGenerativeModel: vi.fn().mockReturnValue({
          generateContent: vi.fn(),
        }),
      })),
    };
  });


describe('GeminiService', () => {
  let geminiService: IGeminiService;
  let mockedGenAI: GoogleGenerativeAI;
  let mockedModel: GenerativeModel;

  beforeEach(() => {
    geminiService = new GeminiService();
    mockedGenAI = (geminiService as any).genAI;
    mockedModel = (geminiService as any).model;
  });

  it('should return the correct text when the API responds successfully', async () => {
    const mockFileData = Buffer.from('mocked image data');

    vi.spyOn(fs.promises, 'readFile').mockResolvedValue(mockFileData);

    const mockResponse:any = {
        response: {
            text: vi.fn().mockResolvedValue('12345'),
        },
    };
    vi.spyOn(mockedModel, 'generateContent').mockResolvedValue(mockResponse);

    const result = await geminiService.consultWithAi(`${imagePath}testfile.jpg`, 'jpeg');

    expect(result).toBe('12345');
    expect(fs.promises.readFile).toHaveBeenCalledWith(path.join(imagePath, 'testfile.jpg'));

    });

  it('should return null and log an error when fs.readFile fails', async () => {
    const mockError = new Error('File read error');

    vi.spyOn(fs.promises, 'readFile').mockRejectedValue(mockError);

    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const result = await geminiService.consultWithAi('/testfile.jpg', 'jpeg');

    expect(result).toBeNull();
    expect(consoleErrorSpy).toHaveBeenCalledWith(mockError);

    consoleErrorSpy.mockRestore();
  });

  it('should return null and log an error when the API call fails', async () => {
    const mockFileData = Buffer.from('mocked image data');

    vi.spyOn(fs.promises, 'readFile').mockResolvedValue(mockFileData);

    const mockApiError = new Error('API error');
    vi.spyOn(mockedModel, 'generateContent').mockRejectedValue(mockApiError);

    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const result = await geminiService.consultWithAi('/testfile.jpg', 'jpeg');

    expect(result).toBeNull();
    expect(consoleErrorSpy).toHaveBeenCalledWith(mockApiError);

        
        consoleErrorSpy.mockRestore();
    });
});
