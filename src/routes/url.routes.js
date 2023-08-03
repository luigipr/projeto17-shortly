import { Router } from "express"
import { signin, signup } from "../controllers/auth.controller.js"
import { validateSchema } from "../middlewares/validateSchema.js"
import { loginSchema, userSchema } from "../schemas/schemas.js"
import validateToken from "../middlewares/validateToken.js"


const urlsRouter = Router()

urlsRouter.post("/urls/shorten", validateToken, validateSchema(userSchema), shortenURL)
urlsRouter.post("/", validateSchema(loginSchema), signin)


export default urlsRouter  