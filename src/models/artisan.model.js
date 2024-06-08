import mongoose, { Schema } from "mongoose";

const artisanSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        phoneNumber: {
            type: String,
            unique: true,
            required: true
        },
        posts: [{
            type: Schema.Types.ObjectId,
            ref: 'Post'
        }],
        followers: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }],
    },
    {
        timestamps: true
    }
);

export const Artisan = mongoose.model("Artisan", artisanSchema);
