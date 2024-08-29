import { GoogleGenerativeAI, GenerativeModel, Part } from "@google/generative-ai";
import { IGeminiService } from "./IGeminiService";
import fs from 'node:fs'
import path from 'node:path'
import dotenv from 'dotenv';

dotenv.config();
//TODO
export class GeminiService implements IGeminiService{

    private publicPath:string = path.join(__dirname, '../../../public')

    private API_KEY:string = String(process.env.GEMINI_API_KEY);
    private genAI:GoogleGenerativeAI = new GoogleGenerativeAI(this.API_KEY);

    private model:GenerativeModel = this.genAI.getGenerativeModel({model:"gemini-1.5-flash"});



    async consultWithAi(receivedFile: string, extension:string): Promise<string|null> {

        const filePath:string = `${this.publicPath}${receivedFile}`;
        const mime:string = `image/${extension}`

        const prompt:string =  `
            Consegue identificar a imagem?\n
            Trata-se de uma imagem de um hidrômetro ou gasômetro.\n
            Sua função é identificar o valor da medição.\n
            A medição é número mostrado no display no artefato de medição.\n
            O número costuma estar ao centro do artefato de medição.\n
            Retorne o número de medição completo ou então, em caso de não conseguir identificar, retorne -1.\n
        `

        try {
            const imageData = await fs.promises.readFile(filePath);
            const imageBase64 = imageData.toString("base64");
            const parts:Part[] = 
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

            const result = await this.model.generateContent({ 
                contents: [
                    { 
                    role: "user", parts 
                }
            ] 
            });

            const response = result.response;
            
            return response.text();
        } catch (error) {
            console.error(error)
            return null;
        }
    }
}