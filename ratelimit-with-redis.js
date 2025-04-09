import express from "express";
import { config } from "./config.js";
import redisClient from "./redis.js";
import RedisStore from "rate-limit-redis";
import rateLimit from "express-rate-limit";

const app = express();
app.use(express.json());

const port = config.PORT;

const limiter = rateLimit({
    windowMs:15 * 60 * 1000, //15 mins
    max:10, //max 10 requests
    standardHeaders: true,
    legacyHeaders: false,
    store:new RedisStore({
        sendCommand:(...args) => redisClient.call(...args), // **it's just a wrapper to call Redis commands under the hood.
        prefix: "rl:"
    })
})

/*
**You're just forwarding Redis commands from the library to your Redis client.
It's needed because different Redis clients have different APIs.
*/


app.use(limiter);

app.get("/", (req, res) => {
    const ip = req.ip;

    const rateLimitInfo = {
        limit: req.rateLimit?.limit, 
        remaining: req.rateLimit?.remaining,
        resetTime: req.rateLimit?.resetTime, 
    };

    res.status(200).json({
        message: "success",
        clientIP: ip,
        rateLimit: {
            totalAllowed: rateLimitInfo.limit,
            remaining: rateLimitInfo.remaining,
            resetTime: rateLimitInfo.resetTime?.toISOString(),
        },
    });
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
