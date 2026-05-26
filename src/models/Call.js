const mongoose = require("mongoose")

const CallRecord = new mongoose.Schema(
    {
        callerName: String,
        callerNumber: String,
        receiverNumber: String,
        city: String,
        callDirection : Boolean,
        callStatus : Boolean,
        callDuration : Number,
        callCost : Number,
        callStartTime : Date,
        callEndTime : Date
    }
)

module.exports = mongoose.model("Call", CallRecord)