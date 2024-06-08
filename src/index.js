import "dotenv/config"
import { app } from './app.js'
import connectDB from "./db/db.js"

// connecting to database
connectDB()

    .then(() => {
        //app to listen at port
        app.listen(process.env.PORT || 5000)
        console.log(`Server running at port = ${process.env.PORT || 5000}`)
    })

    .catch((error) => {
        console.log(`\nMongoDB Connection failed\n`, error)
    })