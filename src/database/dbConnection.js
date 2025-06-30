import mongoose from "mongoose";

export const dbConnection = async () => {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/e-commerce", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(" Database connected successfully");
    } catch (error) {
        console.error("Error connecting to the database", error);
    }
};