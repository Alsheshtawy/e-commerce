import { SubCategory } from "../../models/subCategory.model.js"
import { handelError} from "../..middlewares/catchError.js"
export const getAllsubCategorie = handelError (async(req,res,next) =>{

    let subCategory = await SubCategory.find();

    res.json({message:"all sub categories",subCategory})
    
}) 