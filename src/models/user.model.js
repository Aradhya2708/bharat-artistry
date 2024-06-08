import mongoose, { Schema } from "mongoose"
// import middleware dependencies

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
    },
    {
        timestamps: true
    }
);
// middleware pre hooks : userSchema.pre()  
// middleware post hooks : userSchema.post()

// middleware method instances : userSchema.methods.<methodName> = <methodDefinition>

export const User = mongoose.model("User", userSchema)
