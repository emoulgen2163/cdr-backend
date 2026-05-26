const mongoose = require("mongoose")
const csvParser = require("csv-parser")
const dotenv = require("dotenv")
const fs = require("fs")
const Call = require("./src/models/Call")

dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI

mongoose.connect(MONGODB_URI).then( () => {
        console.log("Connected to MongoDB")
    }
).catch( (e) => {
        console.log(`An error occured: ${e}`)
    }
)

fs.createReadStream("mock-cdr.csv").pipe(csvParser()).on( "data", async(row) => {
        const newCall = new Call(
            {
                callerName: row.callerName,
                callerNumber: row.callerNumber,
                receiverNumber: row.receiverNumber,
                city: row.city,
                callDirection : row.callDirection === "True",
                callStatus : row.callStatus === "True",
                callDuration : row.callDuration,
                callCost : parseFloat(row.callCost),
                callStartTime : new Date(row.callStartTime),
                callEndTime : new Date(row.callEndTime)
            }
        )

        await newCall.save()
    }

).on("end", () => {
        console.log("CSV import complete")
    }
)
