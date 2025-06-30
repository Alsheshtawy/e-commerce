import slugify from "slugify";
import { handelError } from "../../middlewares/catchError.js";
import { Category } from "../../models/category.model.js";

export const getAllCategories = handelError(async (req, res, next) => {
    // جلب كل التصنيفات من قاعدة البيانات
    let Categories = await Category.find();
    
    // إرسال استجابة تحتوي على التصنيفات
    res.json({ message: "all categories", Categories })
});


export const addCategory = handelError(async (req, res, next) => {
    // تخزين اسم الصورة المرفوعة في body (بعد ما multer يعالجها)
    req.body.img = req.file.filename;
    
    // توليد slug من اسم الكاتيجوري لاستخدامه في الروابط
    req.body.slug = slugify(req.body.name);
    
    // إنشاء كائن جديد من التصنيف
    let Category = new Category(req.body);
    
    // طباعة الكاتيجوري في الكونسول (للاختبار أو الديباجينج)
    console.log(Category);
    
    // حفظ الكاتيجوري في قاعدة البيانات
    await Category.save();
    
    // إرسال رد نجاح يحتوي على الكاتيجوري المضاف
    res.json({ message: "category added", Category });
});


export const updateCategory = handelError(async (req, res, next) => {
    // التأكد من وجود الكاتيجوري المطلوب تعديله
    const exist = await Category.findById(req.params.id);
    
    // لو مش موجود، يرجع خطأ
    if (!exist) {
        return next(new Error("category not found"));
    }

    // إنشاء slug جديد بناءً على الاسم الجديد
    req.body.slug = slugify(req.body.name);
    
    // تحديث بيانات الكاتيجوري وإرجاع النسخة المحدثة
    let Category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    
    // إرسال رد نجاح بالتحديث
    res.json({ message: "category updated successfully", Category });
});


export const deleteCategory = handelError(async (req, res, next) => {
    // التأكد من وجود الكاتيجوري المطلوب حذفه
    const exist = await Category.findById(req.params.id);
    
    // لو مش موجود، يرجع خطأ
    if (!exist) {
        return next(new Error("category not found"));
    }

    // حذف الكاتيجوري من قاعدة البيانات
    let Category = await Category.findByIdAndDelete(req.params.id);
    
    // إرسال رد نجاح بالحذف
    res.json({ message: "category deleted successfully", Category });
});
