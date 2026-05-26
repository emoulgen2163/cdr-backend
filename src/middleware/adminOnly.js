const dotenv = require("dotenv")

dotenv.config()

const adminOnly = (request, response, next) => {
    try {
        if (request.user.role !== "admin") {
            return response.status(403).json(
                {
                    error: "Access Denied"
                }
            )
        }

        next()
    } catch (error) {
        response.status(500).json(
                {
                    error: error.message
                }
            )
    }
}

module.exports = adminOnly