import mongoose from "mongoose";
import dotenv from "dotenv";

const db = async(req, res)=>{
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Database connected");
    } catch (error) {

        console.error(error);
        process.exit(1);
        
    }
}

export default db