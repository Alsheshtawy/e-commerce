import Joi from "joi";


export const signupValidation = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required().pattern(/^[a-zA-Z0-9]{3,30}$/),
    firstname: Joi.string().required(),
    lastName: Joi.string().required(),
    rePassword: Joi.valid(Joi.ref("password")).required()

})
export const loginValidation = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required().pattern(/^[a-zA-Z0-9]{3,30}$/)
})