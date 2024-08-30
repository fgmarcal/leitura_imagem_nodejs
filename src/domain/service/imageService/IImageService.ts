export interface IImageService{
    create(image:string):Promise<string>;
    delete(url:string):Promise<void>;
    getExtension(image:string):string;
}