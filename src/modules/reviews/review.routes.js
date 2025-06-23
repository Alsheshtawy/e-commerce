import { Router } from "express";
import { isAuthenticated } from "../../middlewares/authintication.middlewares.js";
import { isAuthorized } from "../../middlewares/authrization.middlewares.js";
import * as reviewSchema from "./review.schema.js";
import * as reviewController from "./review.controller.js"
import { validation } from "../../middlewares/validation.middlewares.js";

const router = Router({ mergeParams: true });


router.post("/",
  isAuthenticated,
  isAuthorized("user"),
  validation(reviewSchema.addReview),
  reviewController.addReview);







export default router