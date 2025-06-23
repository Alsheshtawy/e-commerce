import AppError from "../utils/AppError.js";
import HttpStatusText from "../utils/HttpStatusText.js";
export const validate = (schema) => {
    return (req, res, next) => {
    const { error } = schema.validate({image:req.file, ...req.body, ...req.params, ...req.query }, { abortEarly: false });
    if (!error) {
        next();
    } else {
        let errMsg = error.details.map((err) => {
            return err.message;
        });
        const error = AppError.creat(errorMssage, 400, HttpStatusText.FAIL);
        next(new Error(errMsg));
    }

    }

}


