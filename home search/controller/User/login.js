import UserHome from "../../model/admin/user/user.model.js";
import asyncHandler from "../../utility/asynchandler.js";
import bcrypt from "bcryptjs";
import Api_error from "../../utility/api.error.js";
import Api_success from "../../utility/api.success.js";
import jwt from "jsonwebtoken";

const login = asyncHandler(async(req, res)=>{
    const { email, password } = req.body; 

    if(!email || !password){
        throw new Api_error(400, "Check All Fields", [
            {field:"email" , message:"email is required"},
            {field:"password" , message:"password is required"},
        ])
    }
    const user = await UserHome.findOne({email})
    if(!user){
        throw new Api_error(400, "Email not found , Please signup");
    }
    const passwordcompare = await bcrypt.compare(password, user.password);
    if(!passwordcompare){
        throw new Api_error(400, "Password is incorrect");
    }
    const token = jwt.sign({
        _id:user._id,
        name:user.name,
        email:user.email,
    }, process.env.JWT_SECRET, {
        expiresIn:"1d"
    })
    res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
    })
    res.status(200).json(new Api_success(200, "Login successfull"));
})

export default login