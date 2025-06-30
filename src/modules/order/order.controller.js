import { fileURLToPath } from "url";
import path from "path";
import { Cart } from "../../models/cart.model.js";
import { Coupon } from "../../models/coupon.model.js";
import { Order } from "../../models/order.model.js";
import { Product } from "../../models/product.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import createInvoice from "../../utils/pdfinvoice.js";
import cloudinary from "../../utils/cloud.js";
import { sendEmail } from "../../utils/sendEmails.js";
import { clearCart, updateStock } from "./order.service.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ✅ Create Order
// ✅ Create Order
export const createOrder = asyncHandler(async (req, res, next) => {
  const { payment, address, coupon, phone } = req.body;

  // ✅ تحقق من الكوبون لو موجود
  let checkCoupon;
  if (coupon) {
    checkCoupon = await Coupon.findOne({
      code: coupon,
      expires: { $gt: Date.now() },
    });

    if (!checkCoupon) {
      return next(new Error("Invalid Coupon", { cause: 400 }));
    }
  }

  // ✅ احضر كارت المستخدم
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart || cart.products.length < 1) {
    return next(new Error("Empty cart"));
  }

  const products = cart.products;

  // ✅ تجميع بيانات الأوردر
  let orderProducts = [];
  let orderPrice = 0;

  for (let i = 0; i < products.length; i++) {
    const cartItem = products[i];
    const product = await Product.findById(cartItem.productId);

    if (!product) {
      return next(new Error(`Product ${cartItem.productId} not found`));
    }

    // ✅ تصحيح التحقق من الكمية المتاحة
    if (cartItem.quantity > product.inStock) {
      return next(
        new Error(`Out of stock. Only ${product.inStock} available`)
      );
    }

    orderProducts.push({
      name: product.title,
      quantity: cartItem.quantity,
      itemPrice: product.priceAfterDiscount,
      totalPrice: product.priceAfterDiscount * cartItem.quantity,
      productId: product._id,
    });

    orderPrice += product.priceAfterDiscount * cartItem.quantity;
  }

  // ✅ إنشاء الأوردر
  const order = await Order.create({
    user: req.user._id,
    address,
    phone,
    payment,
    products: orderProducts,
    price: orderPrice,
    coupon: checkCoupon
      ? {
          id: checkCoupon._id,
          name: checkCoupon.code,
          discount: checkCoupon.discount,
        }
      : undefined,
  });

  // ✅ إنشاء فاتورة PDF
  const pdfPath = path.join(__dirname, `./../../tempInvoices/${order._id}.pdf`);
  const invoice = {
    shipping: {
      name: req.user.userName,
      address: order.address,
      country: "Egypt",
    },
    items: order.products,
    subtotal: order.price,
    paid: order.finalPrice,
    invoice_nr: order._id,
  };

  await createInvoice(invoice, pdfPath);

  // ✅ رفع الفاتورة إلى Cloudinary
  const { secure_url, public_id } = await cloudinary.uploader.upload(pdfPath, {
    folder: `${process.env.CLOUD_FOLDER_NAME}/order/invoices`,
  });

  order.invoice = { url: secure_url, id: public_id };
  await order.save();

  // ✅ إرسال الإيميل بالفاتورة
  const isSent = await sendEmail({
    to: req.user.email,
    subject: "Order Invoice",
    attachments: [{ path: secure_url, contentType: "application/pdf" }],
  });

  if (!isSent) return next(new Error("Something went wrong while sending email"));

  // ✅ تحديث المخزون
  updateStock(order.products, true);

  // ✅ تفريغ السلة
  clearCart(req.user._id);

  res.json({ success: true, results: { order } });
});


// ✅ Cancel Order
export const cancelOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) return next(new Error("Invalid order ID", { cause: 400 }));

  if (
    order.status === "delivered" ||
    order.status === "shipped" ||
    order.status === "cancel"
  ) {
    return next(new Error("Cannot cancel this order"));
  }

  order.status = "cancel";
  await order.save();

  // ✅ إعادة تحديث المخزون
  updateStock(order.products, false);

  res.json({ success: true, message: "Order cancelled successfully" });
});
