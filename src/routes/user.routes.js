import { Router } from "express";
import { asyncHandler } from "../utils/asynchandler.js"
import { verifyToken } from "../middlewares/auth.middleware.js"

const router = Router()

router
    .route("/")
    .get(
        asyncHandler(async (req, res) => {
            res.status(200).send("Hello from Home")
        })
    )

export default router