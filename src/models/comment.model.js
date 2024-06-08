import mongoose, { Schema } from "mongoose";

const commentSchema = new Schema(
    {
        commentedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        text: {
            type: String,
            required: true
        },
        votes: {
            type: Number,
            default: 0
        },
    },
    {
        timestamps: true
    }
);

export const Comment = mongoose.model("Comment", commentSchema);
