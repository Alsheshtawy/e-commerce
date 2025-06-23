import slugify from "slugify";
import { handelError} from "../../middlewares/catchError.js";
import { Category } from "../../models/category.model.js";


export const getAllCategories = handelError(async (req, res, next) => {
    let Categories = await Category.find();
    res.json({ message: "all categories", Categories })
})


export const addCategory = handelError(async (req, res, next) => {
    req.body.img = req.file.filename
    req.body.slug = slugify(req.body.name);
    let Category = new Category(req.body);
    console.log(Category)
    await Category.save();
    res.json({ message: "category added",Category })

})

export const updateCategory = handelError(async(req,res,next) =>{
    const exist = await Category.findById(req.params.id);
    if(!exist){
        return next(new Error ("category not found"))
    }
    req.body.slug = slugify(req.body.name);
    let Category = await Category.findByIdAndUpdate(req.params.id,req.body,{new:true});
    res.json({ message: "category updated successfully", Category })

})


export const deleteCategory = handelError(async(req,res,next) =>{

    const exist = await Category.findById(req.params.id);
    if(!exist){
        return next(new Error ("category not found"))
    }
    let Category = await Category.findByIdAndDelete(req.params.id);
    res.json({ message: "category deleted successfully", Category })
})
