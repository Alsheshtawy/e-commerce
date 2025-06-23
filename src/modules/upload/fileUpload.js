import multer from "multer";
import { v4 as uuid } from "uuid";
import fs from "fs";

export const fileUpload = (folder)=>{
    const uploadPath = `./upload/${folder}`;

    if (!fs.existsSync(uploadPath)){
        fs.mkdirSync(uploadPath,{recursive:true});
    }


    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, uploadPath);
            console.log("upload path", uploadPath)
        },

        filename:(req,file,cb)=>{
            cb(null,uuid()+file.originalname)
        }

    })

    const fileFilter = (req,file,cb)=>{
        if(file.mimetype.startsWith("image")){
            cb(null,true)
            }else{
                cb(new Error("invalid file type"),false)
        }
    }

    return multer({storage,fileFilter})
}

export const uploadSingleFile = (folderName,fileName)=>fileUpload(folderName).single(fileName)


export const uploadMultipleFiles = (folderName,fileName)=>fileUpload(folderName,fileName).array(arrayOfFields)


