import { Schema, model, Types } from 'mongoose';


const categorySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: [true, "name is required"],
        trim: true,
        minlength: [3, "too short"]
    },
    slug: {
        type: String,
        lowercase: true,
        required: true,
        unique: [true, "name is required"]
    },
    img: String,
    
    createdby: {
        type: Types.ObjectId,
        ref: "User"
    },
    
})
export const Category = model("Category", categorySchema);   