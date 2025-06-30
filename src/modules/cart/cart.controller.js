import { Cart } from "../../models/cart.model.js";
import { Product } from "../../models/product.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

// ✅ إضافة منتج للعربة
export const addToCart = asyncHandler(async (req, res, next) => {
  const { productId, quantity } = req.body;

  const product = await Product.findById(productId);
  if (!product) return next(new Error("Product not found"));

  if (quantity > product.availableItems) {
    return next(new Error(`Sorry, only ${product.availableItems} items are available`));
  }

  let cart = await Cart.findOne({ user: req.user._id });

  // لو مفيش كارت، نعمل واحد جديد
  if (!cart) {
    cart = await Cart.create({
      user: req.user._id,
      products: [{ productId, quantity }],
    });
  } else {
    // لو المنتج موجود بالفعل نحدث كميته، غير كده نضيفه
    const existingProduct = cart.products.find(p => p.productId.toString() === productId);
    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      cart.products.push({ productId, quantity });
    }
    await cart.save();
  }

  return res.json({ success: true, results: { cart } });
});

// ✅ عرض عربة المستخدم
export const userCart = asyncHandler(async (req, res, next) => {
  // للمستخدم العادي
  if (req.user.role === "user") {
    const cart = await Cart.findOne({ user: req.user._id }).populate("products.productId");
    return res.json({ success: true, results: { cart } });
  }

  // للمشرف
  if (req.user.role === "admin") {
    if (!req.body.cartId) return next(new Error("Cart ID is required"));
    const cart = await Cart.findById(req.body.cartId).populate("products.productId");
    if (!cart) return next(new Error("Cart not found"));
    return res.json({ success: true, results: { cart } });
  }

  next(new Error("Unauthorized"));
});

// ✅ تحديث كمية منتج داخل العربة
export const updateCart = asyncHandler(async (req, res, next) => {
  const { productId, quantity } = req.body;

  const product = await Product.findById(productId);
  if (!product) return next(new Error("Product not found"));

  if (quantity > product.availableItems) {
    return next(new Error(`Sorry, only ${product.availableItems} items are available`));
  }

  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id, "products.productId": productId },
    { $set: { "products.$.quantity": quantity } },
    { new: true }
  ).populate("products.productId");

  if (!cart) {
    return res.status(404).json({ success: false, message: "Product not found in cart" });
  }

  return res.json({ success: true, result: { cart } });
});

// ✅ حذف منتج من العربة
export const removeFromCart = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;

  const product = await Product.findById(productId);
  if (!product) return next(new Error("Product not found"));

  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    { $pull: { products: { productId } } },
    { new: true }
  ).populate("products.productId");

  return res.json({ success: true, results: { cart } });
});
