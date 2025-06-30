import { Router } from "express";
import { isAuthenticated } from "../../middlewares/authentication.middlewares.js";
import { isAuthorized } from "../../middlewares/authorization.middlewares.js";
import { validation } from "../../middlewares/validation.middlewares.js";
import * as couponSchema from './coupon.schema.js';
import * as  couponController from './coupon.controller.js'
const router = Router();




router.post("/", isAuthenticated, isAuthorized("user"), validation(couponSchema.createCoupon), couponController.createCoupon);

router.patch("/:code", isAuthenticated, isAuthorized("user"), validation(couponSchema.updateCopoun), couponController.updateCopoun)

router.delete("/:code", isAuthenticated, isAuthorized("user"), validation(couponSchema.deleteCoppun), couponController.deleteCoppun)

router.get("/", isAuthenticated, isAuthorized("admin"), couponController.allCoupons)

export default router