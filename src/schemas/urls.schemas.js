import Joi from "joi";

export const shortenSchema = Joi.object({
    url: Joi.string().required(),
}).allow("url")