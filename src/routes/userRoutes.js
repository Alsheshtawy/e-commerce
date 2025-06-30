import express from "express";
import { logout, signup } from "../controllers/auth.controller.js";
import { login } from "../controllers/auth.controller.js";
import { changePassword } from "../controllers/auth.controller.js";
const Userrouter = express.Router();

Userrouter.post("/signup",
	signup

);
Userrouter.post("/login",
	login
);
Userrouter.post("/changePassword",
	changePassword
);
Userrouter.post("/logout",
	logout

);

export default Userrouter;