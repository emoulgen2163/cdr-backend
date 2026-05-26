const mongoose = require("mongoose")

const UserRecord = new mongoose.Schema(
    {
        username: String,
        fullName: String,
        email: {
            type: String,
            unique: true
        },
        password: String,
        role: {
            type: String,
            enum: ["admin", "analyst"],
            default: "analyst"
        }
    }
)

module.exports = mongoose.model("User", UserRecord)