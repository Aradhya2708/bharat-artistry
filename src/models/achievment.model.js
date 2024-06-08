import mongoose, { Schema } from "mongoose";

const achievementSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        icon: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

export const Achievement = mongoose.model("Achievement", achievementSchema);
