import express from "express";
import rateLimit from "express-rate-limit";

const app = express();
app.use(express.json());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Max 10 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
});

app.use(limiter);

app.get("/", (req, res) => {
    res.status(200).json({
        message: "Success (In-Memory Rate Limit)",
        ip: req.ip,
        rateLimit: req.rateLimit
    });
});

app.listen(3000, () => {
    console.log("In-memory rate limit server running on port 3000");
});
