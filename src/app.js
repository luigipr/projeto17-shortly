import  express  from "express";
import cors from 'cors';
import dotenv from "dotenv"
import authRouter from "./routes/auth.routes.js";
import urlsRouter from "./routes/url.routes.js";


//criando a api
const app = express()
app.use(cors())
app.use(express.json())
dotenv.config();


app.use(authRouter)
app.use(urlsRouter)


const port = process.env.PORT || 5000;
app.listen(port, console.log(`Servidor rodando na porta ${port}`))