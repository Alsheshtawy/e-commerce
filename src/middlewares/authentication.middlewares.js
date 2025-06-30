import { Token } from "../models/token.model.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

export const isAuthenticated = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new Error("Authorization token is required", { cause: 401 }));
  }

  const token = authHeader.split(" ")[1];

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return next(new Error("Invalid or expired token", { cause: 401 }));
  }

  const tokenDB = await Token.findOne({ token, isValid: true });
  if (!tokenDB) {
    return next(new Error("Token is not valid", { cause: 401 }));
  }

  const user = await User.findById(payload.userId);
  if (!user) {
    return next(new Error("User not found", { cause: 404 }));
  }

  req.user = user;
  next();
});
