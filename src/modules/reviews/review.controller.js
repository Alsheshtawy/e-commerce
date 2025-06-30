import { Order } from "../../models/order.model.js";
import { Product } from "../../models/product.model.js";
import { Review } from "../../models/review.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const addReview = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;
  // بنستخرج معرف المنتج من الرابط

  const { comment, rating } = req.body;
  // بنستخرج التعليق والتقييم من جسم الطلب
console.log("req.product", req.product);
  const order = await Order.findOne({
    user: req.user.id,                     // لازم المستخدم يكون هو صاحب الطلب
    status: "delivered",                   // والطلب يكون تم توصيله
    "products.productId": productId        // والمنتج المطلوب تقييمه موجود ضمن الطلب
  });

  if (!order) {
    // لو الطلب مش موجود أو المنتج مش جواه، نمنع التقييم
    return next(new Error("Can not review this product!", { cause: 400 }));
  }

  const alreadyReviewed = await Review.findOne({
    createdBy: req.user._id,
    productId,
    orderId: order._id
  });
  // بنبحث لو المستخدم قيم المنتج ده من نفس الطلب قبل كده

  if (alreadyReviewed) {
    return next(new Error("Already reviewed by you"));
    // منع التكرار
  }

  const review = await Review.create({
    comment,
    rating,
    createdBy: req.user._id,
    orderId: order._id,
    productId: productId
  });
  // بنسجل التقييم الجديد

  let calcRating = 0;
  const product = await Product.findById(productId);
  // بنجيب المنتج عشان نحدث تقييمه

  const reviews = await Review.find({ productId });
  // بنجيب كل التقييمات الخاصة بالمنتج

  for (let i = 0; i < reviews.length; i++) {
    calcRating += reviews[i].rating;
    // بنجمع التقييمات كلها
  }

  product.averageRate = calcRating / reviews.length;
  // حساب متوسط التقييم

  await product.save();
  // حفظ التعديل في المنتج

  return res.json({ success: true, result: { review } });
  // إرسال التقييم في الاستجابة
});
