const express = require("express")
const User = require("../models/User")
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv");
const authMiddleware = require("../middleware/auth");
const adminOnly = require("../middleware/adminOnly");


dotenv.config()
const router = express.Router()

router.post("/register", async(request, response) => {
        try {
            const username = request.body.username
            const fullName = request.body.fullName
            const email = request.body.email
            const password = request.body.password
            const role = request.body.role
            const hashedPassword = await bcrypt.hash(password, 10)

            const newUser = new User(
                {
                    username: username,
                    email: email,
                    fullName: fullName,
                    password: hashedPassword,
                    role: role,
                }
            )

            await newUser.save()

            response.json(
                {
                    data: newUser
                }
            )
        } catch (e) {
            response.status(500).json(
                {
                    error: e.message
                }
            )
        }
    }
)

router.post("/login", async(request, response) => {
        try {
            const { email, password } = request.body
            const user = await User.findOne(
                {
                    email: email
                }
            )

            if (!user) {
                   return response.status(404).json(
                        {
                            error: "User not found"
                        }
                    ) 
                }

            const isValid = await bcrypt.compare(password, user.password)

            if (!isValid) {
                return response.status(401).json(
                    {
                        error: "Invalid password"
                    }
                )
            }

            const token = jwt.sign(
                {
                    id: user._id,
                    username: user.username,
                    fullName: user.fullName,
                    role: user.role
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: "24h"
                }
            )

            response.json(
                {
                    data: token
                }
            )
        } catch (e) {
            response.status(500).json(
                {
                    error: e.message
                }
            )
        }
    }
)

router.get("/users", authMiddleware, adminOnly, async(request, response) => {
        try {
            const users = User.find( {}, {password: 0} ).lean()
            response.json(
                {
                    users
                }
            )
        } catch (e) {
            response.status(500).json(
                {
                    error: e.message
                }
            )
        }
    }
)

module.exports = router