const express = require("express")
const Call = require("../models/Call")
const adminOnly = require("../middleware/adminOnly");
const authMiddleware = require("../middleware/auth");

const router = express.Router()

router.get("/", async (request, response) => {

        try {
            const page = parseInt(request.query.page) || 1
            const limit = parseInt(request.query.limit) || 100

            const filter = {}

            
            if(request.query.city){
                filter.city = request.query.city
            }

            if (request.query.callerNumber) {
                filter.callerNumber = request.query.callerNumber
            }

            if (request.query.startDate && request.query.endDate) {
                filter.callStartTime = {
                    $gte: new Date(request.query.startDate),
                    $lte: new Date(request.query.endDate),
                }
            }

            const skip = (page - 1) * limit
            const calls = await Call.find(filter).skip(skip).limit(limit)

            response.json(
                {
                    data: calls, page, limit
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

router.get("/analytics/total-calls", async(request, response) => {
        
        try {
            const count = await Call.countDocuments()

            response.json(
                {
                    totalCalls: count
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

router.get("/analytics/total-cost", authMiddleware, adminOnly, async(request, response) => {
        try {
            const sum = await Call.aggregate(
                [
                    {
                        $group : {
                            _id: null,
                            total : {
                                $sum : "$callCost"
                            }
                        }
                    }
                ]
            )

            const value = parseFloat(sum[0].total)

            response.json(
                {
                    totalCost: value
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

router.get("/analytics/total-duration", async(request, response) => {
        try {
            const sum = await Call.aggregate(
                [
                    {
                        $group : {
                            _id: null,
                            total : {
                                $sum : "$callDuration"
                            }
                        }
                    }
                ]
            )

            response.json(
                {
                    totalDuration: sum[0].total
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

router.get("/analytics/avg-duration", async(request, response) => {
        try {
            const average = await Call.aggregate(
                [
                    {
                        $group : {
                            _id: null,
                            average : {
                                $avg : "$callDuration"
                            }
                        }
                    }
                ]
            )

            response.json(
                {
                    averageDuration: average[0].average
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

router.get("/analytics/call-types", async(request, response) => {
        try {
            const firstType = await Call.countDocuments(
                {
                    callDirection: true
                }
            )

            const secondType = await Call.countDocuments(
                {
                    callDirection: false
                }
            )

            response.json(
                {
                    incoming: firstType,
                    outgoing: secondType
                }
            )
        } catch (error) {
            response.status(500).json(
                {
                    error: e.message
                }
            )
        }
    }
)

router.get("/analytics/call-status", async(request, response) => {
        try {
            const trueCalls = await Call.countDocuments(
                {
                    callStatus: true
                }
            ) || 0

            const falseCalls = await Call.countDocuments(
                {
                    callStatus: false
                }
            ) || 0

            response.json(
                {
                    successful: trueCalls,
                    failed: falseCalls
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

router.get("/analytics/top-callers", async(request, response) => {
        try {
            const top = await Call.aggregate(
                [
                    {
                        $group : {
                            _id: "$callerName",
                            totalCalls : {
                                $sum : 1
                            }
                        }
                    }, 
                    {
                        $sort: {
                            totalCalls: - 1,
                        }
                    },
                    {
                        $limit: 100
                    } 
                ]
            )

            response.json(
                {
                    topCallers: top
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

router.get("/analytics/calls-by-city", async(request, response) => {
        try {
            const cityCalls = await Call.aggregate(
                [
                    {
                        $group : {
                            _id: "$city",
                            totalCalls : {
                                $sum : 1
                            }
                        }
                    }, 
                    {
                        $sort: {
                            totalCalls: - 1,
                        }
                    },
                    {
                        $limit: 10
                    } 
                ]
            )

            response.json(
                {
                    callsByCity: cityCalls
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

router.get("/analytics/cost-by-city", async(request, response) => {
        try {
            const cityCost = await Call.aggregate(
                [
                    {
                        $group : {
                            _id: "$city",
                            totalCost : {
                                $sum : "$callCost"
                            }
                        }
                    }, 
                    {
                        $sort: {
                            totalCost: - 1,
                        }
                    },
                    {
                        $limit: 10
                    } 
                ]
            )

            response.json(
                {
                    costByCity: cityCost
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

router.get("/analytics/calls-per-hour", async(request, response) => {
        try {
            const callsPerHour = await Call.aggregate(
                [
                    {
                        $group : {
                            _id: {
                                $hour: "$callStartTime"
                            },
                            count : {
                                $sum : 1
                            }
                        }
                    }, 
                    {
                        $sort: {
                            _id: 1,
                        }
                    }
                ]
            )

            response.json(
                {
                    callsPerHour: callsPerHour
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