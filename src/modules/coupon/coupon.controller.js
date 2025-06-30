import { Coupon } from "../../models/coupon.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import voucher_codes from "voucher-code-generator";

// ✅ إنشاء كوبون
export const createCoupon = asyncHandler(async (req, res, next) => {
  const code = voucher_codes.generate({ length: 5, count: 1 })[0];

  const coupon = await Coupon.create({
    code, // ← هنا استخدمنا code زي المودل
    discount: req.body.discount,
    expires: new Date(req.body.expires),
  });

  res.json({ success: true, result: { coupon } });
});

// ✅ تعديل كوبون
export const updateCopoun = asyncHandler(async (req, res, next) => {
  const coupon = await Coupon.findOne({
    code: req.params.code,
    expires: { $gt: new Date() },
  });

  if (!coupon) return next(new Error("Invalid Coupon", { cause: 404 }));

  coupon.discount = req.body.discount || coupon.discount;
  coupon.expires = req.body.expires ? new Date(req.body.expires) : coupon.expires;

  await coupon.save();

  res.json({ success: true, message: "Coupon updated successfully" });
});

// ✅ حذف كوبون
export const deleteCoppun = asyncHandler(async (req, res, next) => {
  const coupon = await Coupon.findOne({ code: req.params.code });

  if (!coupon) return next(new Error("Invalid Coupon", { cause: 404 }));

  await coupon.deleteOne();

  res.json({ success: true, message: "Coupon deleted successfully" });
});

// ✅ عرض كل الكوبونات
export const allCoupons = asyncHandler(async (req, res, next) => {
  const coupons = await Coupon.find();
  res.json({ success: true, result: { coupons } });
});
