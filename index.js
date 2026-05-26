const express = require("express")
const dotenv = require("dotenv")
const mongoose = require("mongoose")
const cdr = require("./src/routes/cdr")
const auth = require('./src/routes/auth')
const authMiddleware = require("./src/middleware/auth")
const cors = require("cors")
const adminOnly = require("./src/middleware/adminOnly")

dotenv.config()

const expressApp = express()

expressApp.use(express.json())

const PORT = process.env.PORT

expressApp.listen( PORT, () => {
        console.log(`Server running on port: ${PORT}`)
    }
)

const MONGODB_URI = process.env.MONGODB_URI

mongoose.connect(MONGODB_URI).then( () => {
        console.log("Connected to MongoDB")
    }
).catch( (e) => {
        console.log(`An error occured: ${e}`)
    }

)

expressApp.use(cors())
expressApp.use("/api/cdr", authMiddleware, cdr)
expressApp.use("/api/users", authMiddleware, adminOnly, cdr)
expressApp.use("/api/auth", auth)