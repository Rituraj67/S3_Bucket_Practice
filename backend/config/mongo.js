import mongoose from "mongoose";


export const startDB= async ()=>{

    try {
        await mongoose.connect(process.env.MONGO_URI);
    
        console.log("Connected to database....");
      } catch (error) {
        console.log("Connection failed", error);
      }
    
}

