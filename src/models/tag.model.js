import mongoose, { Schema } from "mongoose";

const tagSchema = new Schema(
    {
        name: {
            type: String,
            unique: true,
            required: true
        }
    },
    {
        timestamps: true
    }
);

export const Tag = mongoose.model("Tag", tagSchema);
