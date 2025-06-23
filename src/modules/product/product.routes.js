import { Router } from "express"
import { getAllProducts,addProduct, updateProduct,deleteProduct } from "./product.controller.js"

const productRouter = Router()

productRouter.post("/add",addProduct)

productRouter.put("/updateProduct/:id",updateProduct)

productRouter.delete("/deleteProduct/:id",deleteProduct)

productRouter.get("/getAllProducts",getAllProducts)





export default productRouter