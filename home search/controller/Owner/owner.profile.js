
import Owner from "../../model/admin/owner.model.js";
import asyncHandler from "../../utility/asynchandler.js";
import Api_error from "../../utility/api.error.js";
import Api_success from "../../utility/api.success.js"; 

const ownerprofile = asyncHandler(async(req,res)=>{
    const ownerid = req.owner._id;

    if(!ownerid){
        throw new Api_error(400, "Owner not found");
    }

     const owner = await Owner.findById(ownerid).select("-password");
     
  if (!owner) {
    throw new Api_error(404, "Owner not found");
  }

  res.status(200).json(
    new Api_success(200, "Owner profile fetched successfully", {
      owner:{
        _id: owner._id,
        name: owner.name,
        email: owner.email
      }
    })
  );
})

export default ownerprofile