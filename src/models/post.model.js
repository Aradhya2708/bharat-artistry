import mongoose, { Schema } from "mongoose";

const postSchema = new Schema(
    {
        postedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        artisan: {
            type: Schema.Types.ObjectId,
            ref: 'Artisan'
        },
        media: {
            type: String,
            required: true
        },
        caption: {
            type: String,
            required: true
        },
        votes: {
            type: Number,
            default: 0
        },
        comments: [{
            type: Schema.Types.ObjectId,
            ref: 'Comment'
        }],
        tags: [{
            type: String
        }],
    },
    {
        timestamps: true
    }
);

export const Post = mongoose.model("Post", postSchema);
