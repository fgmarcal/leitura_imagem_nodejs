import { GoogleGenerativeAI, GenerativeModel, Part, GenerationConfig } from "@google/generative-ai";
import { IGeminiService } from "./IGeminiService";
import fs from 'node:fs'
import dotenv from 'dotenv';

dotenv.config();

export class GeminiService implements IGeminiService{

    private API_KEY:string = String(process.env.GEMINI_API_KEY);
    private genAI:GoogleGenerativeAI = new GoogleGenerativeAI(this.API_KEY);

    private generationConfig:GenerationConfig = {
        candidateCount: 1,
        stopSequences:[],
        maxOutputTokens: 2,
        temperature: 0,
    };

    private model:GenerativeModel = this.genAI.getGenerativeModel({
        model:"gemini-1.5-flash", 
        generationConfig:this.generationConfig
    });



    async consultWithAi(receivedFile: string, extension:string): Promise<string|null> {

        const mime:string = `image/${extension}`

        const prompt:string =  `
            Consegue identificar a imagem?\n
            Trata-se de uma imagem de um hidrômetro ou gasômetro.\n
            Sua função é identificar o valor da medição.\n
            A medição é número mostrado no display no artefato de medição.\n
            O display costuma estar ao centro do artefato de medição.\n
            Retorne o número de medição como um inteiro, ignorando os zeros à esquerda\n
            Se não receber uma imagem, retorne 0.
        `

        try {
            const imageData = await fs.promises.readFile(receivedFile);
            const imageBase64 = imageData.toString("base64");
            const request = 
                [
                    {
                    text:prompt
                },
                    {
                    inlineData: {
                        mimeType:mime,
                        data:imageBase64,
                    }
                }                
            ]

            const result = await this.model.generateContent(request)

            const response = result.response;

            return response.text();
        } catch (e) {
            console.error(e)
            return null;
        }
    }
}