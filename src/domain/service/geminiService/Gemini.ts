import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config();

const API_KEY:string = String(process.env.GEMINI_API_KEY);

const genAI = new GoogleGenerativeAI(API_KEY);

const model = genAI.getGenerativeModel({model:"gemini-1.5-flash"});



export const readBillWithAI = async (file:string):Promise<string> =>{
    return ""
}