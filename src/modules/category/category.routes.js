import { Router } from "express";
import { addCategory,deleteCategory,getAllCategories,updateCategory} from "./category.controller.js";
import { uploadSingleFile } from "../upload/fileUpload.js";
import { validate } from "../../middlewares/validate.js";
import { addCategoryValidation } from "./category.validation.js";
const categoryRouter = Router();

categoryRouter.post("/add",uploadSingleFile("category","image"),validate(addCategoryValidation),addCategory)

categoryRouter.delete("/deleteCategory/:id",deleteCategory)

categoryRouter.get("/allCategories",getAllCategories)

categoryRouter.put("/updateCategory/:id",updateCategory)

export default categoryRouter
