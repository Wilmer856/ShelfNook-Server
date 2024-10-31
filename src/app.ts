import express, { NextFunction, Request, Response } from "express"

const app = express()
const port = 3000

app.get('/api/healthcheck', (req : Request, res : Response) => {
    res.send('Hello World')
})

app.listen(port, () => {
    console.log("Testing API route")
})