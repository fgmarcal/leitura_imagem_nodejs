import { GenerativeModel, GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
import { IGeminiService } from "./IGeminiService";

dotenv.config();

export class GeminiService implements IGeminiService{

    private API_KEY:string;
    private genAI:GoogleGenerativeAI;
    private model:GenerativeModel

    constructor(){
        this.API_KEY = String(process.env.GEMINI_API_KEY)
        this.genAI = new GoogleGenerativeAI(this.API_KEY)
        this.model = this.genAI.getGenerativeModel({model:"gemini-1.5-flash"});
    }

    async consultWithAi(file: string): Promise<string> {
        const prompt =  `
            The following text is a base64 link to a PNG image.
            The encoded file is an image of a Water or Gas bill.
            Identify the amount due on the bill, looking for phrases like "valor total", "valor", "valor da fatura", "valor devido", "total", or "total da guia".
            Return the amount as text (string), including decimal places (cents).
            The value should start with the currency symbol "R$", but only return the numerical value.
            If the bill is not for water or gas, return -3.
            If the amount cannot be identified, return -1:
            ${file}
        `
        const result = await this.model.generateContent(prompt);
        return result.response.text();
    }

}