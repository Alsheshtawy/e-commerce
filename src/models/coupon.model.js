import { Schema,model } from 'mongoose';

const couponSchema = new Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    expires: {
        type: Date,
        required: true,
    },
    discount: {
        type: Number
    }
}, {
    timestamps: true,
    versionKey: false
})
export const Coupon = model('Coupon', couponSchema)