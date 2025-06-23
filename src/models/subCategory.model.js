import { model, Schema, Types } from "mongoose";

const subCategory = new Schema({
    name: {
        type: String,
        unique: [true, "name is required"],
        trim: true
    },
    slug: {
        type: String,
        required: true,
        lowerCase: true
    },
    img: String,

    createdBy: {
        type: String,
        ref: "User"
    },
    category: {
        type: Types.ObjectId,
        ref: "Category"
    }
}, {
    timestamps: true,
    versionKey: false

})

export const SubCategory = model("SubCategory", subCategory)