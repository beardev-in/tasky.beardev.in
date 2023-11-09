import mongoose from "mongoose";
import 'dotenv/config'; //automatically passes all env variables

const {MONGODB_ATLAS_SERVER_INFO, DATABASE_NAME} = process.env; //available env variables are captured

async function connectDB() {
    try {
        await mongoose.connect(`${MONGODB_ATLAS_SERVER_INFO}/${DATABASE_NAME}`); 
        console.log("Mongo DB Connected");
    } catch (error) {
        console.log(error);
    }
}

connectDB();
