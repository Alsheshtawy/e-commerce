import slugify from "slugify";
import { Product } from "../../models/product.model.js"
import  { handelError } from "../../middlewares/catchError.js"


export const getAllProducts = handelError(async (req, res, next) => {

    const products = await Product.find();

    res.json({ message: "all products", products })

})

export const addProduct = handelError(async (req, res, next) => {
    let exist = Product.findOne({ title: req.body.title });
    if (exist) {
        return next(new Error("product already exist"))
    }
    req.body.slug = slugify(req.body.title);

    const product = new Product(req.body)
    await product.save()
    res.json({ message: "product added successfully", product })
})

export const updateProduct = handelError(async (req, res, next) => {
    const exist = await Product.findById(req.params.id);
    if (!exist) {
        return next(new Error("product not found"))
    }
    req.body.slug = slugify(req.body.name);
    const product = await product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: "product updated successfully", product })

})

export const deleteProduct = handelError(async (req, res, next) => {

    const exist = await Product.findById(req.params.id);
    if (!exist) {
        return next(new Error("product not found"))
    }
    const product = await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "product deleted successfully", product })
})