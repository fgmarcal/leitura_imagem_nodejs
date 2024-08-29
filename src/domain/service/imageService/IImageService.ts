import { Url } from "node:url"

export interface IImageService{
    create(image:string):Promise<string>;
    delete(url:Url):Promise<void>;
    getExtension(image:string):string;
}