import { nanoid } from "nanoid"
import {db} from "../db/db.connection.js"


export async function shortenUrl(req,res) {
    const session = res.locals.session
    console.log(session)

    const {url} = req.body
    if (!url) return res.sendStatus(400)

    try {
    const shortUrl = nanoid(8)
    console.log(shortUrl)   
    const userId = session.userId;
    console.log(userId)
    const response = await db.query(`INSERT INTO urls (url, "shortUrl", "userId") VALUES ($1, $2, $3) RETURNING id`, [url, shortUrl, userId])
    console.log(response, shortUrl)
    const id = response.rows[0].id
    const body = {id, shortUrl}
    console.log(response)
    res.status(201).send( body )
    } catch (err) {
        res.status(500).send(err.message)
        }
}

export async function getUrls(req,res) {
    const {id} = req.params
    console.log(id)
    try {
        const response = await db.query(`SELECT * FROM urls WHERE urls.id = $1`, [id])
        console.log(response.rows)
        if (response.rowCount === 0) return res.sendStatus(404)
        const url = response.rows[0]
        delete url.userId
        delete url.visitCount
        delete url.createdAt
    res.status(200).send(url)
    } catch (err) {
        res.status(500).send(err.message)
        }
}

export async function openUrl(req, res) {
    const {shortUrl} = req.params;
    try {
    const url = await db.query(`SELECT * FROM urls WHERE urls."shortUrl" = $1`, [shortUrl])
    if (url.rows.length === 0) return res.sendStatus(404)
    let visitCount = url.rows[0].visitCount
    console.log(visitCount)
    visitCount++
    console.log(visitCount)
    await db.query(`UPDATE urls SET "visitCount" = $1 WHERE "shortUrl" = $2`, [visitCount, shortUrl]);

    res.redirect(url.rows[0].url);
    } catch (err) {
        console.log(err)
        res.status(500).send(err.message)
    }

}


export async function deleteUrl(req,res) {
    const session = res.locals.session
    console.log(session)
    const {id} = req.params
        
    try {
        const url2 = await db.query(`SELECT * FROM urls WHERE urls.id = $1 AND urls."userId" = $2`, [id, session.userId])
        if(url2.rowCount === 0) return res.sendStatus(401);
        const url1 = await db.query(`SELECT * FROM urls where urls.id = $1`, [session.userId])
        if(url1.rowCount === 0) return res.sendStatus(404);    
        
        await db.query(`DELETE FROM urls WHERE urls.id = $1`, [id])

        res.sendStatus(204)
    } catch (err) {
        console.log(err)
        res.status(500).send(err.message)
    }
}


export async function myUrls(req, res) {
    const session = res.locals.session
    try {
        console.log(session)
        const userQ = await db.query(`SELECT * FROM users WHERE users.id = $1`, [session.userId])

        const user = userQ.rows[0]
 //       if (!user) return res.sendStatus(404)
        const shortenedUrls = await db.query(`SELECT * FROM urls WHERE urls."userId" = $1`, [session.userId])
        //console.log(shortenedUrls)
        if (shortenedUrls.rows[0].id === null) shortenedUrls = []

        const userUrls = shortenedUrls.rows.map((url) => ({
            id: url.id,
            shortUrl: url.shortUrl,
            url: url.url,
            visitCount: url.visitCount,
        }));
        console.log(userUrls)
        const visitCount = shortenedUrls.rows.reduce((total, url) => total + url.visitCount, 0);    
        console.log(visitCount)

        const response = {
            id: user.id,
            name: user.name,
            visitCount: visitCount,
            shortenedUrls: userUrls,
        };

        res.status(200).send(response)
    } catch (err) {
        console.log(err)
        res.status(500).send(err.message)
    }
}

export async function ranking(req, res) {
    try {
        const result = await db.query(`SELECT users.id, users.name, COUNT(urls.id) AS "linksCount", COALESCE(SUM(urls."visitCount"), 0) 
        AS "visitCount" FROM users LEFT JOIN urls ON users.id = urls."userId" GROUP BY users.id ORDER BY "visitCount" DESC LIMIT 10`)
        //(`SELECT user.id, user.name, COUNT(urls.id) AS "linksCount", COALESCE(SUM(urls."visitCount"), 0) AS "visitCount" FROM users LEFT JOIN urls ON user.id = urls."userId" GROUP BY users ORDER BY "visitCount" DESC LIMIT 10`)
        console.log(result)

        res.status(200).send(result.rows)
    } catch (err) {
        console.log(err)
        res.status(500).send(err.message)
    }
}