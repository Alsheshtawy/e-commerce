import slugify from "slugify";
import { handelError} from "../../middlewares/catchError.js";
import { Brand} from "../../models/brand.model.js";


export const addBrand = handelError(async(req,resizeBy,next) => {
    req.body.slug = slugify(req.body.name)
    let brand = new Brand(req.body);
    await brand.save();
    res.json({message:"brand added successfully",brand})
})



export const getAllBrands = handelError(async(req,res,next)=> {
   let brand = await Brand.find();
   res.json({message:"all brands",brand})
})


export const updateBrand = handelError(async(req,res,next)=> {
    const exist = await Brand.findById(req.params.id);
    if(!exist){
        return next (new Error("brand not found"))
    }
    req.body.slug = slugify(req.body.name);
    let brand = await Brand.findByIdAndUpdate(req.params.id,req.body,{new:true})
    res.json({message:"brand updated successfully",brand})

})

export const deleteBrand = handelError(async(req,res,next) =>{

    const exist = await Brand.findById(req.params.id);
    if(!exist){
        return next(new Error ("brand not found"))
    }
    let Brand = await Brand.findByIdAndDelete(req.params.id);
    res.json({ message: "brand deleted successfully", Brand })
})