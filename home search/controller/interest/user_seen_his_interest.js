import House from "../../model/admin/owner_interface/house_details.model.js";
import asyncHandler from "../../utility/asynchandler.js";
import Api_error from "../../utility/api.error.js";
import Api_success from "../../utility/api.success.js";
import Interested from "../../model/interested/interest.js";

const alluserinterested = asyncHandler(async (req, res) => {
  const user_id = req.user?._id;

  if (!user_id) {
    throw new Api_error(400, "User ID missing");
  }

  // Fetch all interest records created by this user
  const interests = await Interested.find({ interested_user: user_id })
    .populate("created_owner", "name email mobile_number")
    .populate("interested_house_id", "type room price square_feet state city pincode area");

  if (!interests.length) {
    throw new Api_error(404, "No interested properties found for this user");
  }

  // Map to structured response
  const results = interests.map((interest) => ({
    owner: {
      name: interest.created_owner?.name,
      email: interest.created_owner?.email,
      mobile_number: interest.created_owner?.mobile_number,
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
    new Api_success(200, "Interested properties fetched successfully for the user", results)
  );
});

export default alluserinterested;

