import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const OwnerSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    mobile_number: {
        type: Number,
        required: true
    },
    verification_token: {
        type: Number,
        required: true
    },
    is_verified: {
        type: Boolean,
        default: false
    },
    expires_at: {
        type: Date,
        required: true
    },
    reset_token:{
        type: Number
    },
    reset_token_expires_at: {
        type: Date
    }

},{
    timestamps: true
});

OwnerSchema.pre("save", async function(next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password, 10)}
        next()
})

const Owner =  mongoose.model("Owner", OwnerSchema );

export default Owner