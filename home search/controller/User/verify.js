import UserHome from "../../model/admin/user/user.model.js"
import asyncHandler from "../../utility/asynchandler.js";
import Api_error from "../../utility/api.error.js";
import Api_success from "../../utility/api.success.js";
import { pendingUsers } from "./signup.js";

const verify = asyncHandler(async(req, res)=>{
    const {token} = req.body;
    if(!token){
        throw new Api_error(400, "Token is required");
    }

    let matchedemail=null;
    let userData = null;

    for(const[email,data] of pendingUsers.entries()){
        if (String(data.verification_token) === String(token)){
            matchedemail=email;
            userData=data;
            break;
        }
    }
    if(!userData){
        throw new Api_error(400, "Invalid verification token");
    }

    // Check token expiry
    if(new Date() > userData.expires_at){
        pendingUsers.delete(matchedemail);
        throw new Api_error(400, "Verification token has expired");
    }

    const user = await UserHome.create({
        name:userData.name,
        email:matchedemail,
        password:userData.password,
        mobile_number:userData.mobile_number,
        verification_token:userData.verification_token,
        is_verified:true,
        expires_at:userData.expires_at
    })
    
    pendingUsers.delete(matchedemail);

    res.status(200).json(new Api_success(200, "User registered successfully",{
        user:{
            _id:user._id,
            name:user.name,
            email:user.email
        }
    }))
})

export default verify