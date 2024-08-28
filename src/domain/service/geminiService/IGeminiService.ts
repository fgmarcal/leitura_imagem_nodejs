export interface IGeminiService{

    consultWithAi(file:string):Promise<string>
}