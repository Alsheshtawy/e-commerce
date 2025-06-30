import { model, Schema } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true
		},
		password: {
			type: String,
			required: true
		},
		role: {
			type: String,
			enum: ["user", "admin"]
		},
		firstname: {
			type: String,
			required: true
		},
		lastName: {
			type: String,
			required: true
		},
		isBlocked: {
			type: Boolean,
			default: false
		},
		passwordChangedAt: Date
	},
	{
		timestamps: true,
		versionKey: false
	}
);

// احذف pre("save") خالص عشان ما يحصلش تشفير مرتين

// خلي pre("findOneAndUpdate") عشان تشفير الباسورد لما تتغير
userSchema.pre("findOneAndUpdate", function () {
	if (this._update.password) {
		this._update.password = bcrypt.hashSync(this._update.password, 10);
	}
});

export const User = model("User", userSchema);