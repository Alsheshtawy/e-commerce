import { model, schema } from "mongose";

const subCategory = new schema({
    name: {
        type: String,
        unique: [true, "name is required"],
        trim: true
    },
    slug: {
        type: String,
        required: true,
        lowerCase: true,
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

export const SubCategory = model("subCategory", subCategory)