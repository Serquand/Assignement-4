require("dotenv").config()

const express = require("express")
const app = express()
const cors = require("cors")
const PORT = 3000
const path = require("path")
const eventRouter = require("./router/ToDo")

app.use(cors("*"))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, '/public')))

app.use("/event", eventRouter)

app.listen(PORT, () => {
    console.clear()
    console.log("Listening on PORT", PORT)
})