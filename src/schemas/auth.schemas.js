import Joi from "joi";

export const userSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(3).required(),
    confirmPassword:  Joi.string().min(3).required()
}).allow("id", "name", "email", "password", "confirmPassword")

export const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(3).required()
}).allow("email", "password")