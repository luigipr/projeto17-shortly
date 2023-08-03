import bcrypt from "bcrypt"
import { v4 as uuid } from "uuid"
import {db} from "../db/database.connection.js"

export async function signin(req , res) {
    //sign-in
        const {email, password} = req.body
       
        try {
            const user = await db.query(`SELECT * from users WHERE users.email = $1`, [email]).rows
            //db.collection("usuarios").findOne({email})
            if (user.rowCount === 0) return res.status(404).send("Usuário não cadastrado")
    
            const correctPW = bcrypt.compareSync(password, user[0].password)
            if (!correctPW) return res.status(401).send("Senha incorreta")
            
            await db.query(`DELETE * FROM sessions WHERE "UserId" = $1`, [user.id])
            //db.collection("sessions").deleteMany({ userID: user._id })    
            const token = uuid()

            await db.query(`INSERT INTO sessions (token, userId) VALUES ($1, $2, $3)`, [token, user[0].id, user.name])
            db.collection("sessions").insertOne({ token, userID: user._id })

            res.status(200).send({token, user})
        } catch (err) {
        res.status(500).send(err.message)
        }
};

export async function signup(req, res) {

    const {username, email, password, confirmPassword} = req.body

    if (password !== confirmPassword) return res.status(422).send('as senhas devem ser iguais!')   

    try {
        const user = await db.query(`SELECT * from users WHERE users.email = $1`, [email])
		//const user = await db.collection("usuarios").findOne({ email })
		if (user) return res.status(409).send("Esse usuario já existe!")

        const hash = bcrypt.hashSync(password, 10)


		await db.query(`INSERT INTO users (username, email, password) VALUES ($1, $2, $3)`, [username, email, password])
        //db.collection("usuarios").insertOne({ username, email, password: hash})
        //console.log(username, email)
		res.status(201).send(user)
	} catch (err) {
		res.status(500).send(err.message)
	}
};