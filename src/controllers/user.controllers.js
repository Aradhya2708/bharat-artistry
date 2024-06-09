import { asyncHandler } from "../utils/asynchandler.js"; // Utility function to handle async errors
import { ApiError } from "../utils/ApiError.js"; // Custom error class for API errors
import { User } from "../models/user.model.js"; // User model
import jwt from 'jsonwebtoken'; // JSON Web Token library for token generation and verification
import bcrypt from 'bcryptjs'; // Library for hashing passwords
import { ApiResponse } from "../utils/ApiResponse.js"; // Custom response class for API responses
import nodemailer from 'nodemailer'
import CryptoJS from "crypto-js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// Registeration Logic:
/*
-Register User: get Username, Email, Password from Frontend
-take avatar
-Check
-add to db/users
-status : pending
-set cookies

-Verify OTP (seperate route)
-Send OTP via mail
-Check OTP
-status : verified
*/

/*
When Registered, send OTP and redirect to verify OTP
*/

// Utility to generate tokens
const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId); // Fetch the user from the database
        const accessToken = user.generateAccessToken(); // Generate an access token for the user
        const refreshToken = user.generateRefreshToken(); // Generate a refresh token for the user

        user.refreshToken = refreshToken; // Save the refresh token in the user's document
        await user.save({ validateBeforeSave: false }); // Save the user without running validation

        return { accessToken, refreshToken }; // Return the generated tokens
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access token");
    }
};

// Utility to Send Email
const sendEmail = async (to, subject, text) => {
    try {
        // Create a transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            service: 'Gmail', // Using Gmail as the email service
            auth: {
                user: process.env.EMAIL_USER, // Your Gmail address
                pass: process.env.EMAIL_PASS, // Your Gmail password or App password
            },
        });

        // Set up email data with unicode symbols
        let mailOptions = {
            from: process.env.EMAIL_USER, // Sender address
            to: to, // List of receivers
            subject: subject, // Subject line
            text: text, // Plain text body
        };

        // Send mail with defined transport object
        await transporter.sendMail(mailOptions);

        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email', error);
        throw new Error('Error sending email');
    }
}

// Utility to generate OTP
const generateOTP = () => {
    // Generate a random 4-byte (32-bit) value and convert it to a hexadecimal string
    const otp = CryptoJS.lib.WordArray.random(4).toString(CryptoJS.enc.Hex);
    return otp; // 8 characters long OTP
};


//Registeration Controller:
const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body

    if (!username || !email || !password) {
        console.log(username, email, password)
        throw new ApiError(400, "Please fill all fields")
    }   

    const userExists = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (userExists) {
        throw new ApiError(400, "User with email or username already exists")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)

    const userCreated = await User.create({
        username,
        email,
        password,
        avatar: avatar.url,
        role: 'user',
        status: 'pending'
    })

    const createdUser = await User.findById(userCreated._id).select('-password -refreshToken')
    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(createdUser._id)

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(201)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(201, createdUser, "User registered succesfully"))
})

const sendOTP = asyncHandler(async (req, res) => {
    const { email } = req.body

    if (!email) {
        throw new ApiError(400, "Please enter email")
    }

    const user = await User.findOne({
        email
    })

    if (!user) {
        throw new ApiError(404, 'User not found')
    }

    if (user.status !== 'pending') {
        throw new ApiError(400, 'User already OTP Verified')
    }

    const otp = generateOTP()
    user.otp = otp
    await user.save()

    await sendEmail(email, 'Verify your email', `Your OTP is ${otp}`)

    return res
        .status(200)
        .json(new ApiResponse(200, 'OTP Sent Successfully'))
})

const verifyOTP = asyncHandler(async (req, res) => {
    const { email, otp } = req.body

    if (!email || !otp) {
        throw new ApiError(400, "Please enter Email and OTP")
    }

    const user = await User.findOne({ email, otp })

    if (!user) {
        return res.status(400).json({ message: 'Invalid OTP' })
    }

    user.status = 'active'
    user.otp = undefined
    await user.save()

    res.status(200).json(new ApiResponse(200, "User verified successfully"))
})

// Login Logic:
/*
get username/email
get password
check
send cookies
*/

const loginUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body
    if (!username && !email) {
        throw new ApiError(400, "Username or email is required"); // Throw an error if both fields are missing
    }

    // Find the user by username or email
    const user = await User.findOne({
        $or: [{ username }, { email }]
    });

    // Check if user exists and the password is correct
    if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new ApiError(401, "Invalid Credentials"); // Throw an error if credentials are invalid
    }

    // Generate access and refresh tokens for the user
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

    // Fetch the logged-in user without the password and refreshToken fields
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    // Set options for the cookies
    const options = {
        httpOnly: true, // Make cookies accessible only by the web server
        secure: true // Send cookies only over HTTPS
    };

    // Send the response with the logged-in user and set cookies
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, { user: loggedInUser, accessToken, refreshToken }, "User logged in successfully"));
})

const getCurrentUser = asyncHandler(async (req, res) => {
    if (!req.user) {
        throw new ApiError(404, "User not found"); // Throw an error if no user is found in the request
    }
    // Send a success response with the authenticated user
    return res.status(200).json(new ApiResponse(200, req.user, "User fetched successfully"));
});

export default {
    registerUser,
    sendOTP,
    verifyOTP,
    loginUser,
    getCurrentUser
}
