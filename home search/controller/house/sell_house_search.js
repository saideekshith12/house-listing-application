import House from "../../model/admin/owner_interface/house_details.model.js";
import asyncHandler from "../../utility/asynchandler.js";
import Api_error from "../../utility/api.error.js";
import Api_success from "../../utility/api.success.js";

const sell_housesearch = asyncHandler(async (req, res) => {
  const { city, area } = req.body;


  if (!city || !area) {
    throw new Api_error(400, "Check All Fields", [
      { field: "city", message: "City is required" },
      { field: "area", message: "Area is required" },
    ]);
  }


  const cityRegex = new RegExp(city, 'i');
  const areaRegex = new RegExp(area, 'i');

  const houses = await House.find({
    city: cityRegex,
    area: areaRegex,
    type: "sell",
  }).populate("created_by", "name email mobile_number");

  return res.status(200).json(
    new Api_success(200, "Houses fetched successfully", {
      houses: houses || [], 
    })
  );
});

export default sell_housesearch;
