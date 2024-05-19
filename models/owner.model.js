import mongoose from "mongoose";

const ownerSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
			minlength: 6,
		},
        role: {
            type: String,
            enum: ['admin', 'owner'],
            required: true
        },	
	},
	{ timestamps: true }
);

const Owner = mongoose.model("Owner", ownerSchema);

export default Owner;