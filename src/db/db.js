import mongoose from "mongoose"
import "dotenv/config"

const connectDB = async () => {
    try {
        // mongoose.connect(MONGODB_URI): function to connect to daatabse, returns promise

    } catch (error) {
        console.log(`\nMongoDB connection failed\n`, error)
        process.exit(1)
    }
}

export default connectDB