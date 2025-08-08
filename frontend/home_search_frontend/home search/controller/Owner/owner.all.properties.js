import  House from "../../model/admin/owner_interface/house_details.model.js";
import asyncHandler from "../../utility/asynchandler.js";
import Api_error from "../../utility/api.error.js";
import Api_success from "../../utility/api.success.js";

const allhouses = asyncHandler(async(req,res)=>{
    const ownerid = req.owner._id;

    if(!ownerid){
        throw new Api_error(400, "Please login");
    }
    const houses = await House.find({created_by:ownerid}).populate("created_by", "name email mobile_number");
    if(!houses){
        throw new Api_error(404, "Houses not found");
    }
    res.status(200).json(new Api_success(200, "Houses fetched successfully", houses))
})

export default allhouses