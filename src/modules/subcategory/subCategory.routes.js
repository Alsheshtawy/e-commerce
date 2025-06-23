import { Router } from "express"
import { getAllsubCategories,addSubCategory, updateSubCategory,deleteSubCategory } from "./subCategory.controller.js"

const subCategoryRouter = Router()

subCategoryRouter.get("/getAllsubCategories",getAllsubCategories)

subCategoryRouter.post("/add",addSubCategory)

subCategoryRouter.put("/updateSubCategory/:id",updateSubCategory)

subCategoryRouter.delete("/deleteSubCategory/:id",deleteSubCategory)

export default subCategoryRouter