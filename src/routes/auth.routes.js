import { Router } from "express"
import { signin, signup } from "../controllers/auth.controller.js"
import { validateSchema } from "../middlewares/validateSchema.js"
import { loginSchema, userSchema } from "../schemas/auth.schemas.js"


const authRouter = Router()

authRouter.post("/signup", validateSchema(userSchema), signup)
authRouter.post("/signin", validateSchema(loginSchema), signin)


export default authRouter