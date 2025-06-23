import { User } from "../../models/user.model.js";
import { handelError } from "../../middlewares/catchError.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// Register
export const register = handelError(async (req, res, next) => {
  const user = new User(req.body);

  // هش الباسورد قبل الحفظ
  const salt = bcrypt.genSaltSync(10);
  user.password = bcrypt.hashSync(user.password, salt);

  await user.save();

  const token = jwt.sign({ userId: user._id, role: user.role }, "secretkey", {
    expiresIn: "7d",
  });

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

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  const isMatch = bcrypt.compareSync(password, user.password);

  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  const token = jwt.sign({ userId: user._id, role: user.role }, "secretkey", {
    expiresIn: "7d",
  });

  return res.status(200).json({
    success: true,
    message: "Login successful",
    user,
    token,
  });
});

// ✅ Change Password
export const changePassword = handelError(async (req, res, next) => {
  const { email, password: oldPassword, newpassword: newPassword } = req.body;

  if (!email || !newPassword) {
    return next(new Error("All fields are required"));
  }

  const user = await User.findOne({ email });

  if (!user) {
    return next(new Error("Invalid email or password"));
  }

  const isMatch = bcrypt.compareSync(oldPassword, user.password);

  if (!isMatch) {
    return next(new Error("Invalid email or password"));
  }

  const updatedUser = await User.findOneAndUpdate(
    { email },
    {
      password: newPassword,
      passwordChangedAt: Date.now()
    },
    { new: true }
  );

  const token = jwt.sign({ userId: updatedUser._id, role: updatedUser.role }, "secretkey");

  return res.json({
    success: true,
    message: "Password changed successfully",
    user: updatedUser,
    token
  });
});

// ✅ Protected Route
export const protectedRouter = handelError(async (req, res, next) => {
  const { token } = req.headers;
  if (!token) return next(new Error("Token is required"));

  let userPayload;
  try {
    userPayload = jwt.verify(token, "secretkey");
  } catch (err) {
    return next(new Error("Invalid token", 401));
  }

  const user = await User.findById(userPayload.userId);
  if (!user) return next(new Error("User not found", 404));

  if (user.passwordChangedAt) {
    const passwordTime = parseInt(user.passwordChangedAt.getTime() / 1000);
    if (passwordTime > userPayload.iat) {
      return next(new Error("Invalid token, please login again", 401));
    }
  }

  req.user = user;
  next();
});