import express from "express";
import dotenv from "dotenv";
dotenv.config(); // ← ضروري لتحميل .env

import { globalErrorHandling } from "./middlewares/globalErrorHandling.js";
import brandRouter from "./modules/brand/brand.routes.js";
import subCategoryRouter from "./modules/subcategory/subCategory.routes.js";
import categoryRouter from "./modules/category/category.routes.js";
import productRouter from "./modules/product/product.routes.js";
import { uploadSingleFile } from "./modules/upload/fileUpload.js"; 
import { dbConnection } from "./database/dbConnection.js";
import authRouter from "./modules/auth/auth.routes.js"; 
import userRouter from "./modules/user/user.routes.js";
import reviewRouter from "./modules/reviews/review.routes.js";
import orderRouter from "./modules/order/order.routes.js";
import carttRouter from "./modules/cart/cart.routes.js";
import couponRouter from "./modules/coupon/coupon.routes.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.post("/upload", uploadSingleFile("products", "image"), (req, res) => {
  res.json({ message: "File uploaded successfully", file: req.file });
});

app.use("/product", productRouter);
app.use("/brand", brandRouter);
app.use("/subCategory", subCategoryRouter);
app.use("/category", categoryRouter);
app.use("/review", reviewRouter);
app.use("/order", orderRouter);
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/cart", carttRouter);
app.use("/coupon", couponRouter);

app.use("*", (req, res, next) => {
  const err = new Error("Route not found");
  err.statusCode = 404;
  next(err);
});

app.use(globalErrorHandling);

app.listen(PORT, () => {
  dbConnection();
  console.log("Server is running on port:", PORT);
});
