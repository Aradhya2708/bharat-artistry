import mongoose, { Schema } from "mongoose"
// import middleware dependencies
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema = new Schema(
    {
        username: {
            type: String,
            unique: true,
            required: true
        },
        email: {
            type: String,
            unique: true,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        avatar: {
            type: String,
            required: true
        },
        score: {
            type: Number,
            default: 0
        },
        followers: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }],
        followingUsers: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }],
        followingArtisans: [{
            type: Schema.Types.ObjectId,
            ref: 'Artisan'
        }],
        achievements: [
            {
                achievement: {
                    type: Schema.Types.ObjectId, ref: 'Achievement'
                },
                timestamp: {
                    type: Date,
                    default: Date.now
                }
            }],
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user'
        },
        otp: {
            type: String
        },
        status: {
            type: String,
            enum: ['pending', 'active'],
            default: 'pending'
        }
    },
    {
        timestamps: true
    }
);
// middleware pre hooks : userSchema.pre()
// Hash the password before saving the user
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// middleware post hooks : userSchema.post()

// middleware method instances : userSchema.methods.<methodName> = <methodDefinition>
// Method to check if the password is correct
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// Method to generate an access token
userSchema.methods.generateAccessToken = function () {
    return jwt.sign({ _id: this._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
};

// Method to generate a refresh token
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign({ _id: this._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
};


export const User = mongoose.model("User", userSchema)
