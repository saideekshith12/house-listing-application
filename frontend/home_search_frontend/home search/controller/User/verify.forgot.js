import UserHome from "../../model/admin/user/user.model.js";
import asyncHandler from "../../utility/asynchandler.js";
import Api_error from "../../utility/api.error.js";
import Api_success from "../../utility/api.success.js";

const verifypassworduser = asyncHandler(async(req,res)=>{
    const {token} = req.body;
    if(!token){
        throw new Api_error(400, "Token is required");
    }
    const user = await UserHome.findOne({reset_token:token});
    if(!user){
        throw new Api_error(400, "Invalid or expired token");
    }
    if (new Date() > new Date(user.reset_token_expires_at)) {
    throw new Api_error(400, "Token has expired");
    }
     user.reset_token = null;
     user.reset_token_expires_at = null;
     await user.save();
    res.status(200).json(new Api_success(200, "Token is valid",{
        user:{
            _id:user._id,
            name:user.name,
            email:user.email
        }
    }));
})

export default verifypassworduser