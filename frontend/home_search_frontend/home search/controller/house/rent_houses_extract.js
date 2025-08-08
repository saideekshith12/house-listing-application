import House from "../../model/admin/owner_interface/house_details.model.js";
import asyncHandler from "../../utility/asynchandler.js";
import Api_error from "../../utility/api.error.js";
import Api_success from "../../utility/api.success.js";

const rentallhouses = asyncHandler(async(req,res)=>{
    const houses = await House.find({type:"rent"})
    if(!houses){
        throw new Api_error(404, "Houses not found, We are working on it");
    }
    res.status(200).json(new Api_success(200, "Houses fetched successfully", houses))
})

export default rentallhouses