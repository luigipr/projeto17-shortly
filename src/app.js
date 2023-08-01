import  express  from "express";
import cors from 'cors';
import dotenv from "dotenv"
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";


//criando a api
const app = express()
app.use(cors())
app.use(express.json())
dotenv.config();



app.use(gamesRouter)
app.use(customersRouter)
app.use(rentalsRouter)


const port = process.env.PORT || 5000;
app.listen(port, console.log(`Servidor rodando na porta ${port}`))