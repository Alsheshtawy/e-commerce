import { User } from "../../models/user.model.js";
import { Token } from "../../models/token.model.js";
import { handelError } from "../../middlewares/catchError.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// Generate JWT Token
const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// Register
export const register = handelError(async (req, res, next) => {
  const user = new User(req.body);
  const salt = bcrypt.genSaltSync(10);
  user.password = bcrypt.hashSync(user.password, salt);
  await user.save();

  const token = generateToken({ userId: user._id, role: user.role });

  await Token.create({ token, user: user._id }); // حفظ التوكن في الداتا بيز

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    user,
    token,
  });
});

// Login
export const login = handelError(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ success: false, message: "Invalid email or password" });
  }

  const token = generateToken({ userId: user._id, role: user.role });

  await Token.create({ token, user: user._id });

  return res.status(200).json({
    success: true,
    message: "Login successful",
    user,
    token,
  });
});

// Change Password
export const changePassword = handelError(async (req, res, next) => {
  const { email, password: oldPassword, newpassword: newPassword } = req.body;
  if (!email || !newPassword) return next(new Error("All fields are required"));

  const user = await User.findOne({ email });
  if (!user || !bcrypt.compareSync(oldPassword, user.password)) {
    return next(new Error("Invalid email or password"));
  }

  const salt = bcrypt.genSaltSync(10);
  const hashed = bcrypt.hashSync(newPassword, salt);

  const updatedUser = await User.findOneAndUpdate(
    { email },
    { password: hashed, passwordChangedAt: Date.now() },
    { new: true }
  );

  const token = generateToken({ userId: updatedUser._id, role: updatedUser.role });

  await Token.create({ token, user: updatedUser._id });

  return res.json({
    success: true,
    message: "Password changed successfully",
    user: updatedUser,
    token,
  });
});

// Protected Route
export const protectedRouter = handelError(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new Error("Token is required", { cause: 401 }));
  }

  const token = authHeader.split(" ")[1];

  let userPayload;
  try {
    userPayload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return next(new Error("Invalid token", { cause: 401 }));
  }

  const tokenInDB = await Token.findOne({ token, isValid: true });
  if (!tokenInDB) return next(new Error("Token is not valid", { cause: 401 }));

  const user = await User.findById(userPayload.userId);
  if (!user) return next(new Error("User not found", { cause: 404 }));

  if (user.passwordChangedAt) {
    const passwordTime = parseInt(user.passwordChangedAt.getTime() / 1000);
    if (passwordTime > userPayload.iat) {
      return next(new Error("Invalid token, please login again", { cause: 401 }));
    }
  }

  req.user = user;
  next();
});
