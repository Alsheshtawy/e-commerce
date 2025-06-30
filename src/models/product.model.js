import { model, Schema,Types } from "mongoose";


const ProductSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        unique: [true, "name is required"],
        minLength: [2, "too short"]
    },

    slug: {
        type: String,
        required: true,
        lowerCase: true
    },

    description: {
        type: String,
        required: true,
        minLength: [5, "too short"],
        MaxLength: 1000
    },

    imgCover: String,
    images: [String],
    price: { type: Number, required: true, min: 0 },
    priceAfterDiscount: {
        type: Number, required: true, min: 0
    },
    sold: Number,
    Stock: {
        type: Number,
        required: true,
        min: 0

    },
    category: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    subCategory: {
        type: Schema.Types.ObjectId,
        ref: "SubCategory",
        required: true
    },
    brand:{
        type: Schema.Types.ObjectId,
        ref: "Brand",
        required: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    ratingsAverage: {
        type: Number,
        min: 0,
        max: 5
    },
    rateCount:Number
},{
    timestamps: true,
    versionKey: false

})

ProductSchema.methods.inStock = function (quantity) {
  return quantity <= this.Stock;
};

 export const Product = model("Product", ProductSchema)


