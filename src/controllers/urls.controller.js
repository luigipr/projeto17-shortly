import { nanoid } from "nanoid"
import {db} from "../db/db.connection.js"


export async function shortenUrl(req,res) {
    const token = req.params;
    const {url} = req.body
    if (!url) return res.sendStatus(400)

    try {
    const shortUrl = nanoid(8)
    console.log(shortUrl)
    const session = await db.query(`SELECT * from sessions WHERE sessions.token = $1`, [res.locals.session.token]).rows[0];
    if(!session) return (409)
    console.log(session)
    const userId = session.userId;

    const response = await db.query(`INSERT INTO urls ("shortUrl", userId) VALUES ($1, $2, $3) RETURNING id`, [shortUrl, userId, url])
    console.log(response, shortUrl)

    console.log(response)
    res.status(201).send(response)
    } catch (err) {
        res.status(500).send(err.message)
        }
}

