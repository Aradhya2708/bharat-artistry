import "dotenv/config"
import { app } from './app.js'
import connectDB from "./db/db.js"

// connecting to database
connectDB()

.then(()=>{
    //app to listen at port
    

})

.catch((error)=>{
    console.log(`\nMongoDB Connection failed\n`, error)
})