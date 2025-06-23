import slugify from "slugify";
import { SubCategory } from "../../models/subCategory.model.js"
import { handelError } from "../../middlewares/catchError.js"

export const getAllsubCategories = handelError(async (req, res, next) => {

    let subCategory = await SubCategory.find();

    res.json({ message: "all sub categories", subCategory })

})

export const addSubCategory = handelError(async (req, res, next) => {
    req.body.slug = slugify(req.body.name);
    let subCategory = new subCategory(req.body);



    await subCategory.save();
    res.json({ message: "sub category added", subCategory })

    
    subCategory || res.json({ message: "category doesn't added successfully" }) //null || true
    
    !subCategory || res.json({ message: "category added successfully" })
    
    res.json({ message: "sub category added", subCategory })
})

export const updateSubCategory = handelError(async(req,res,next) =>{
    const exist = await SubCategory.findById(req.params.id);
    if(!exist){
        return next(new Error ("category not found"))
    }
    req.body.slug = slugify(req.body.name);
    let subCategory = await subCategory.findByIdAndUpdate(req.params.id,req.body,{new:true});
    res.json({ message: "sub category updated successfully", subCategory })

})

export const deleteSubCategory = handelError(async(req,res,next) =>{

    const exist = await SubCategory.findById(req.params.id);
    if(!exist){
        return next(new Error ("category not found"))
    }
    let subCategory = await subCategory.findByIdAndDelete(req.params.id);
    res.json({ message: "sub category deleted successfully", subCategory })
})