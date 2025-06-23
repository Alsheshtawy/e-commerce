import { Schema,Types,model } from "mongoose";

const reviwewSchema = new Schema({
    comment:String,
    user:{
        type:Types.ObjectId,
        ref:"User",
        required:true
    },
    product:{
        type:Types.ObjectId,
        ref:"Product",
        required:true
    },
    rate:{
        type:Number,
        required:true,
        min:0,
        max:5
    },
})
export const Review = model("Review", reviwewSchema);