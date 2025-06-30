import Joi from "joi";

export const addCategoryValidation = Joi.object({
name:Joi.string().min(2).max(20).required(),
image:Joi.object().required()
})