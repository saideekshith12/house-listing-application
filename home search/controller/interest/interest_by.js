import House from "../../model/admin/owner_interface/house_details.model.js";
import asyncHandler from "../../utility/asynchandler.js";
import Api_error from "../../utility/api.error.js";
import Api_success from "../../utility/api.success.js";
import Interested from "../../model/interested/interest.js";

const allinterested = asyncHandler(async (req, res) => {
  const owner_id = req.owner?._id;

  if (!owner_id) {
    throw new Api_error(400, "Owner ID missing");
  }

  // Fetch all interest records created by this owner
  const interests = await Interested.find({ created_owner: owner_id })
    .populate("interested_user", "name email mobile_number")
    .populate("interested_house_id", "type room price square_feet state city pincode area");

  if (!interests.length) {
    throw new Api_error(404, "No interested users found for your properties");
  }

  // Map to structured response
  const results = interests.map((interest) => ({
    user: {
      name: interest.interested_user?.name,
      email: interest.interested_user?.email,
      mobile_number: interest.interested_user?.mobile_number,
    },
    house: {
      type: interest.interested_house_id?.type,
      room: interest.interested_house_id?.room,
      price: interest.interested_house_id?.price,
      square_feet: interest.interested_house_id?.square_feet,
      state: interest.interested_house_id?.state,
      city: interest.interested_house_id?.city,
      pincode: interest.interested_house_id?.pincode,
      area: interest.interested_house_id?.area,
    },
    interested: interest.interested,
    interest_id: interest._id,
    date: interest.createdAt,
  }));

  res.status(200).json(
    new Api_success(200, "Interested users and properties fetched successfully", results)
  );
});

export default allinterested;
