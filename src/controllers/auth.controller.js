import bcrypt from "bcrypt"
import { v4 as uuid } from "uuid"
import {db} from "../db/db.connection.js"

export async function signin(req , res) {
    //sign-in
        const {email, password} = req.body
       console.log(email)
       console.log(password)

        try {
            const user = await db.query(`SELECT * from users WHERE users.email = $1`, [email])
            //db.collection("usuarios").findOne({email})
            console.log(user.rows)
            if (!user.rowCount === 0) return res.status(404).send("Usuário não cadastrado")
    
            const correctPW = bcrypt.compareSync(password, user.rows[0].password)
            if (!correctPW) return res.status(401).send("Senha incorreta")
            console.log(correctPW)

            await db.query(`DELETE FROM sessions WHERE sessions."userId" = $1`, [user.rows[0].id])
            //db.collection("sessions").deleteMany({ userID: user._id })    

            
            const token = uuid()

            const answer = await db.query(`INSERT INTO sessions (token, "userId") VALUES ($1, $2)`, [token, user.rows[0].id])
            //db.collection("sessions").insertOne({ token, userID: user._id })
            console.log(answer)

            res.status(200).send({token})
        } catch (err) {
        res.status(500).send(err.message)
        }
};

export async function signup(req, res) {

    const {name, email, password, confirmPassword} = req.body

    if (password !== confirmPassword) return res.status(422).send('as senhas devem ser iguais!')   

    try {
        const user = await db.query(`SELECT * from users WHERE users.email = $1`, [email])
        console.log(user.rows)
		//const user = await db.collection("usuarios").findOne({ email })
		if (user.rowCount !== 0) return res.status(409).send("Esse usuario já existe!")

        const hash = bcrypt.hashSync(password, 10)


		const postUser = await db.query(`INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *`, [name, email, hash])
        //db.collection("usuarios").insertOne({ name, email, password: hash})
        //console.log(name, email)
		res.sendStatus(201)
	} catch (err) {
		res.status(500).send(err.message)
	}
};