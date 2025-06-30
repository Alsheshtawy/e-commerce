import slugify from "slugify";
import { Product } from "../../models/product.model.js"
import { handelError } from "../../middlewares/catchError.js"

export const getAllProducts = handelError(async (req, res, next) => {
  // جلب كل المنتجات من قاعدة البيانات
  const products = await Product.find();

  // إرسال المنتجات كرد مع رسالة
  res.json({ message: "all products", products });
});

export const addProduct = handelError(async (req, res, next) => {
  // التحقق إذا كان المنتج موجود بالفعل بنفس العنوان
  const exist = await Product.findOne({ title: req.body.title });
  if (exist) {
    return next(new Error("product already exists")); // لو موجود يرجع خطأ
  }

  // إنشاء slug من عنوان المنتج (للاستخدام في الروابط)
  req.body.slug = slugify(req.body.title);

  // إنشاء كائن منتج جديد بالبيانات المرسلة
  const product = new Product(req.body);

  // حفظ المنتج في قاعدة البيانات
  await product.save();

  // إرسال رسالة نجاح مع بيانات المنتج الجديد
  res.json({ message: "Product added successfully", product });
});

export const updateProduct = handelError(async (req, res, next) => {
  // التحقق من وجود المنتج المراد تعديله
  const exist = await Product.findById(req.params.id);
  if (!exist) {
    return next(new Error("product not found")); // لو مش موجود يرجع خطأ
  }

  // تحديث الـ slug بناءً على العنوان الجديد
  req.body.slug = slugify(req.body.title);

  // تعديل بيانات المنتج وإرجاع النسخة المعدلة
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });

  // إرسال رسالة نجاح مع المنتج المعدل
  res.json({ message: "Product updated successfully", product });
});

export const deleteProduct = handelError(async (req, res, next) => {
  // التحقق من وجود المنتج قبل الحذف
  const exist = await Product.findById(req.params.id);
  if (!exist) {
    return next(new Error("product not found")); // لو مش موجود يرجع خطأ
  }

  // حذف المنتج من قاعدة البيانات
  const product = await Product.findByIdAndDelete(req.params.id);

  // إرسال رسالة نجاح مع المنتج المحذوف
  res.json({ message: "Product deleted successfully", product });
});
