import { Router } from "express";
import { isAuthenticated } from "../../middlewares/authentication.middlewares.js";
import { isAuthorized } from "../../middlewares/authorization.middlewares.js";
import { validation } from "../../middlewares/validation.middlewares.js";
import * as orderSchema from "./order.schema.js";
import * as orderController from "./order.controller.js"
const router = Router();


router.post("/", isAuthenticated, isAuthorized("user"), validation(orderSchema.createOrder), orderController.createOrder)



router.patch("/:id", isAuthenticated, isAuthorized("user"), validation(orderSchema.cancelOrder), orderController.cancelOrder)


export default router;