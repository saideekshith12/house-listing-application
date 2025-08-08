import House from "../../model/admin/owner_interface/house_details.model.js";
import asyncHandler from "../../utility/asynchandler.js";
import Api_error from "../../utility/api.error.js";
import Api_success from "../../utility/api.success.js";

const getSingleHouse = asyncHandler(async (req, res) => {
  const { houseId } = req.params;

  const house = await House.findById(houseId).populate("created_by", "name email mobile_number");
  if (!house) {
    throw new Api_error(404, "House not found");
  }

  res.status(200).json(new Api_success(200, "House fetched successfully", house));
});

export default getSingleHouse;

