import { User } from "../../models/user.model.js";
import bcrypt from "bcrypt";
import { signupValidation } from "./user.validation.js";

// 🔐 Sign Up
export const signUp = async (req, res) => {
  try {
    const { error } = signupValidation.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({ message: "Validation error", details: error.details });
    }

    const { email, password } = req.body;
    const foundUser = await User.findOne({ email });

    if (foundUser) {
      return res.status(400).json({ message: "User already registered" });
    }

    const hashedPassword = bcrypt.hashSync(password, 8);
    const newUser = new User({ ...req.body, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// 🔐 Login
export const login = async (req, res) => {
  try {
    const foundUser = await User.findOne({ email: req.body.email });

    if (!foundUser) {
      return res.status(404).json({ message: "You need to register first" });
    }

    const match = bcrypt.compareSync(req.body.password, foundUser.password);

    if (!match) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    res.status(200).json({ message: "Welcome", user: foundUser });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ➕ Add User
export const addUser = async (req, res) => {
  try {
    const existing = await User.findOne({ email: req.body.email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    req.body.password = bcrypt.hashSync(req.body.password, 8);
    const user = new User(req.body);
    await user.save();

    res.status(201).json({ message: "User added successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// 📥 Get All Users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ message: "All users", users });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ✏️ Update User
export const updateUser = async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!updated) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User updated successfully", user: updated });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ❌ Delete User
export const deleteUser = async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully", user: deleted });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};