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
            You're receiving a base64 file as a string; read this ${file} and identify if this is a brazilian WATER or GAS bill.
            If this is a valid bill (WATER or GAS), find the due amount and return it as a string.
            If this is not a valid bill, return -1 as a string.
            Do not send any other information rather then the amount or -1
        `
        const result = await this.model.generateContent(prompt);
        return result.response.text();
    }

}