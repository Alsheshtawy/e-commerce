import { Router } from "express"
import { getAllsubCategories } from "./subCategory.controller.js"

const subCategoryRouter = Router()
subCategoryRouter.get("/getAllsubCategories",getAllsubCategories)






export default subCategoryRouter