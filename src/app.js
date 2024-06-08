// creation of app

import express from "express"
// import middleware dependencies
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express()

// app.use(middlewares) [middleware config]
app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    })
)
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser()); // to use cookie-parser : set, access cookies

// routes import
import userRouter from './routes/user.routes.js'

// routes declaration
app.use("/api/v1/user", userRouter)

export { app }

