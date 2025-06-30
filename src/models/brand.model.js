import { model, Schema, Types } from "mongoose";

const brandSchema = new Schema({
    name: { type: String, 
    required: true,
    minLength:[3,"too short"],
    trim : true 
},
logo:String,
slug:{
    type:String,
    lowerCase:true,
    required:true
},
createdBy:{
    type:Types.ObjectId,
    ref:"User"
}


},{
    timestamps:true,
    versionKey:false

})
export const Brand = model("Brand",brandSchema)