import House from "../../model/admin/owner_interface/house_details.model.js";
import asyncHandler from "../../utility/asynchandler.js";
import Api_error from "../../utility/api.error.js";
import Api_success from "../../utility/api.success.js";

const owner_delete = asyncHandler(async (req, res) => {
    const ownerid = req.owner._id;
    const {houseid} = req.params;
    if(!ownerid){
        throw new Api_error(400, "Owner not found");
    }
    if(!houseid){
        throw new Api_error(400, "House ID is required");
    }
    const house = await House.findOneAndDelete({_id:houseid, created_by:ownerid});
    if(!house){
        throw new Api_error(404, "House not found or not authorized to delete");
    }
    res.status(200).json(new Api_success(200, "House deleted successfully", house));
})

export default owner_delete