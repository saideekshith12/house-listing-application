import UserHome from "../../model/admin/user/user.model.js";
import asyncHandler from "../../utility/asynchandler.js";
import Api_error from "../../utility/api.error.js";
import Api_success from "../../utility/api.success.js";

const profile = asyncHandler(async(req, res)=>{
    const userid = req.user._id
    if(!userid){
        throw new Api_error(400, "User not found, please login");
    }
    const user = await UserHome.findById(userid).select("-password")
    if (!user) {
        throw new Api_error(404, "User not found");
      }
    
      res.status(200).json(
        new Api_success(200, "User profile fetched successfully", {
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            mobile_number: user.mobile_number,
          },
        })
      );

})

export default profile