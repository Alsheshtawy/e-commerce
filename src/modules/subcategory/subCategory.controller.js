import slugify from "slugify";
import { SubCategory } from "../../models/subCategory.model.js";
import { handelError } from "../../middlewares/catchError.js";

// GET all subcategories
export const getAllsubCategories = handelError(async (req, res, next) => {
    const subCategory = await SubCategory.find();
    res.json({ message: "all sub categories", subCategory });
});

// ADD subcategory
export const addSubCategory = handelError(async (req, res, next) => {
    if (!req.body.name || typeof req.body.name !== "string") {
        return res.status(400).json({ message: "Name is required and must be a string" });
    }

    req.body.slug = slugify(req.body.name);

    const subCategory = new SubCategory(req.body);
    await subCategory.save();

    res.json({ message: "sub category added", subCategory });
});

// UPDATE subcategory
export const updateSubCategory = handelError(async (req, res, next) => {
    const exist = await SubCategory.findById(req.params.id);
    if (!exist) {
        return next(new Error("category not found"));
    }

    if (req.body.name && typeof req.body.name === "string") {
        req.body.slug = slugify(req.body.name);
    }

    const subCategory = await SubCategory.findByIdAndUpdate(req.params.id, req.body, { new: true });

    res.json({ message: "sub category updated successfully", subCategory });
});

// DELETE subcategory
export const deleteSubCategory = handelError(async (req, res, next) => {
    const exist = await SubCategory.findById(req.params.id);
    if (!exist) {
        return next(new Error("category not found"));
    }

    const subCategory = await SubCategory.findByIdAndDelete(req.params.id);
    res.json({ message: "sub category deleted successfully", subCategory });
});
 