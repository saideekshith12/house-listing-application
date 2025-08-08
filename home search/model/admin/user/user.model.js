import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema({
    name: {
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
    reset_token: {
        type: String,
        
    },
    reset_token_expires_at: {
        type: Date,
        
    }
}, {
    timestamps: true
});

UserSchema.pre("save", async function(next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password, 12);
    }
    next();
});

const UserHome =  mongoose.model("UserHome", UserSchema);

export default UserHome