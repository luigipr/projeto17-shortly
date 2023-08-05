import { db } from "../db/db.connection.js"

export async function validateToken(req, res, next) {
    const { authorization } = req.headers
    const token = authorization?.replace("Bearer ", "")

    if (!token) return res.sendStatus(401)

    try {
        const session = await db.query(`SELECT * FROM sessions WHERE token = $1`, [token])
        //const session = await db.collection("sessions").findOne({ token })
        if(session.rowCount === 0) return res.sendStatus(401)
        res.locals.session = session.rows[0]

        next()

    } catch (err) {
        res.status(500).send(err.message)
    }
}