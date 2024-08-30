import { IImageService } from "./IImageService";
import path from 'node:path'
import fs from 'node:fs'
import crypto from 'node:crypto'
import { imagePath } from "./ImagePath";



export class ImageService implements IImageService{

    private publicPath:string = imagePath;

    async create(image: string): Promise<string> {
        const fileName = await this.saveFile(image);
        const fullpathFile = this.publicPath + fileName;
        return fullpathFile;
    }

    async delete(url: string): Promise<void> {
        try {
            await fs.promises.unlink(url)
        } catch (error) {
            console.log(error)
        }
    }

    getExtension(image:string):string{
        const split = image.split('base64,');
        const extension = split[0].split(';')[0].split('/')[1];
        return extension;
    }

    private async saveFile(image:String):Promise<string>
    {
        const split = image.split('base64,');
        const extension = split[0].split(';')[0].split('/')[1];
        const base64Image = split[1];
        const uuid = crypto.randomUUID();

        const fileName =  `${uuid}.${extension}`;
        const filePath =  path.join(this.publicPath, fileName);
        
        fs.writeFile(filePath,base64Image, {encoding: 'base64'}, 
        function(err){
            if(err){
                console.error(err)
                console.log('Error to create file:'+filePath)
            }
        });

        return fileName;
    }

}