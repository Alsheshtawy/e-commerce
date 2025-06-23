import { model, Schema } from "mongoose";
import bcrypt from "bcrypt";



const userSchema = new Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},

		role: {
			type: String,
			enum: ["user", "admin"],
			default: "user",
		},

		firstname: {
			type: String,
			required: true,
		},


		lastName: {
			type: String,
			required: true,
		},
		lastLogin: {
			type: Date,
			default: Date.now,
		},
		isVerified: {
			type: Boolean,
			default: false,
		},

		isBlocked: {
			type: Boolean,
			default: false,
		},
		passwordChangedAt:Date
	
	},{
		timestamps: true,
		versionKey: false,
	}

);
userSchema.pre("save", function (){
	this.password = bcrypt.hashSync(this.password, 8)
})

userSchema.pre("findOneAndUpdate", function (){
	if(this._update.password) this._update.password = bcrypt.hashSync(this._update.password, 8)
	
})
export const User = model("User", userSchema)