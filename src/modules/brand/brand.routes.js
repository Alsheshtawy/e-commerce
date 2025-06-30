import { Router } from "express";
import { addBrand,getAllBrands,updateBrand,deleteBrand } from "./brand.controller.js";

const brandRouter = Router()


brandRouter.post("/add",addBrand)

brandRouter.get("/getAllBrands",getAllBrands)

brandRouter.put("/updateBrand:id",updateBrand)

brandRouter.delete("/deleteBrand/:id",deleteBrand)



export default brandRouter