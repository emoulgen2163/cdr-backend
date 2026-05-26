const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")


dotenv.config()

const authMiddleware = (request, response, next) =>{

    try {
        const token = request.headers.authorization?.split(" ")[1]

        if(!token){
            return response.status(401).json(
                {
                    error: "Unauthorized access"
                }
            )
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        request.user = decoded

        next()
    } catch (error) {
        response.status(500).json(
                {
                    error: error.message
                }
            )
    }
    
}

module.exports = authMiddleware