import joi from 'joi';
import { isValidObjectId } from 'mongoose';

// ✅ للتحقق من ObjectId بشكل موحد
const objectIdValidator = (value, helpers) => {
  if (!isValidObjectId(value)) {
    return helpers.error("any.invalid");
  }
  return value;
};

// ✅ إضافة منتج للعربة
export const addToCart = joi.object({
  productId: joi.string().custom(objectIdValidator, "ObjectId Validation").required(),
  quantity: joi.number().integer().min(1).required()
}).required();

// ✅ تحديث كمية منتج في العربة
export const updateCart = joi.object({
  productId: joi.string().custom(objectIdValidator, "ObjectId Validation").required(),
  quantity: joi.number().integer().min(1).required()
}).required();

// ✅ حذف منتج من العربة
export const removeFromCart = joi.object({
  productId: joi.string().custom(objectIdValidator, "ObjectId Validation").required()
}).required();

// ✅ عرض العربة (لـ admin فقط لو محتاج cartId)
export const userCart = joi.object({
  cartId: joi.string().custom(objectIdValidator, "ObjectId Validation")
}).required();
