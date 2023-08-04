import { Router } from "express"
import { validateSchema } from "../middlewares/validateSchema.js"
import {validateToken} from "../middlewares/validateToken.js"
import { shortenUrl } from "../controllers/urls.controller.js"
import { shortenSchema } from "../schemas/urls.schemas.js"


const urlsRouter = Router()

urlsRouter.post("/urls/shorten", validateSchema(shortenSchema), shortenUrl)
//urlsRouter.post("/", validateSchema(loginSchema), signin)


export default urlsRouter  