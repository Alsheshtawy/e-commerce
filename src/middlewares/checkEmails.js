import { User } from "../models/user.model.js";
import AppError from "../utils/AppError.js";



export const checkEmails = async (req, res, next) => {
    let isFound = await User.findOne({ email: req.body.email });
    if (isFound) {
       const error = AppError.creat("Email already exists", 400 , HttpStatusText.FAIL);
       return next(error);
        }
        next();
    }
    