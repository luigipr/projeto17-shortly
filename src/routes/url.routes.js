import { Router } from "express"
import { validateSchema } from "../middlewares/validateSchema.js"
import {validateToken} from "../middlewares/validateToken.js"
import { shortenUrl, getUrls, deleteUrl, openUrl, myUrls, ranking} from "../controllers/urls.controller.js"
import { shortenSchema } from "../schemas/urls.schemas.js"


const urlsRouter = Router()

urlsRouter.post("/urls/shorten", validateToken, validateSchema(shortenSchema), shortenUrl)
urlsRouter.get("/urls/:id", getUrls)
urlsRouter.get("/urls/open/:shortUrl", openUrl)
urlsRouter.delete("/urls/:id", validateToken, deleteUrl)
urlsRouter.get("/users/me", validateToken, myUrls)
urlsRouter.get("/ranking", ranking)


export default urlsRouter  