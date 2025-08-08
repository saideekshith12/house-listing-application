import UserHome from "../../model/admin/user/user.model.js";
import asyncHandler from "../../utility/asynchandler.js";
import Api_error from "../../utility/api.error.js";
import Api_success from "../../utility/api.success.js";

const resetpassworduser = asyncHandler(async(req,res)=>{
    const {email, password} = req.body;
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
    user.password = password;
    await user.save();
    res.status(200).json(new Api_success(200, "Password reset successfully"));

})

export default resetpassworduser