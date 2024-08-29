export interface IGeminiService{

    consultWithAi(file:string, extension:string):Promise<string|null>
}