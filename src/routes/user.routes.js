import { Router } from "express";
import { asyncHandler } from "../utils/asynchandler.js"
import { verifyToken, isOTPVerified } from "../middlewares/auth.middleware.js"
import userControllers from '../controllers/user.controllers.js'
import { upload } from "../middlewares/multer.middleware.js";

const router = Router()

router
    .route("/")
    .get(
        asyncHandler(async (req, res) => {
            res.status(200).send("Hello from Home")
        })
    )

// Register route
router
    .post('/register', upload.fields([
        {
            name: "avatar",
            maxCount: 1
        }
    ]), userControllers.registerUser)
    .post('/send-otp', userControllers.sendOTP)
    .post('/verify-otp', userControllers.verifyOTP)
    .post('/login', isOTPVerified, userControllers.loginUser)
    .get('/me', verifyToken, isOTPVerified, userControllers.getCurrentUser)

export default router