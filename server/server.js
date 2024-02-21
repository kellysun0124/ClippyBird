import express from 'express'
import cors from 'cors'

const app = express()
const port = process.env.PORT

app.use(cors())
app.use(express.json())

// Routers
import homepageRouter from "./routes/homepage.js"
app.use("/homepage", homepageRouter)



app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})