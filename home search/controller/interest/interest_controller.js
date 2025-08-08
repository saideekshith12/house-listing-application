import Interested from "../../model/interested/interest.js";
import asyncHandler from "../../utility/asynchandler.js";
import Api_error from "../../utility/api.error.js";
import Api_success from "../../utility/api.success.js";
import sendEmail from "../../utility/email.js";
import House from "../../model/admin/owner_interface/house_details.model.js";

const createInterest = asyncHandler(async (req, res) => {
  const { data } = req.body;
  const { houseid } = req.params;

  const userid = req.user?._id;

  if (!userid) {
    throw new Api_error(400, "User not authenticated");
  }

  if (!houseid) {
    throw new Api_error(400, "House ID is required");
  }

  if (data !== true) {
    throw new Api_error(400, "Invalid request — 'data' must be true");
  }

  // ✅ Get house and extract owner info
  const house = await House.findById(houseid).populate("created_by", "name email");
  if (!house) {
    throw new Api_error(404, "House not found");
  }

  const ownerid = house.created_by._id;

  // ✅ Create interest document
  const interest = await Interested.create({
    interested: true,
    interested_user: userid,
    created_owner: ownerid,
    interested_house_id: houseid
  });

  // ✅ Push interest to the house document
  await House.findByIdAndUpdate(
    houseid,
    { $push: { int_by: interest._id } },
    { new: true }
  );

  // ✅ Populate fields for response and email
  const populated = await interest.populate([
    { path: "interested_user", select: "name email mobile_number" },
    { path: "created_owner", select: "name email" },
    { path: "interested_house_id", select: "type room price square_feet state city pincode area" },
  ]);

  // ✅ Send email notification to owner
  try {
    await sendEmail({
      to: populated.created_owner.email,
      subject: "Someone is interested in your property",
      html: `
        <h2>Hello ${populated.created_owner.name},</h2>
        <p>${populated.interested_user.name} has shown interest in your property.</p>
        <h3>Property Details:</h3>
        <p>Type: ${populated.interested_house_id.type}</p>
        <p>Room: ${populated.interested_house_id.room}</p>
        <p>Price: ₹${populated.interested_house_id.price}</p>
        <p>Square Feet: ${populated.interested_house_id.square_feet} sq.ft</p>
        <p>Location: ${populated.interested_house_id.area}, ${populated.interested_house_id.city}, ${populated.interested_house_id.state} - ${populated.interested_house_id.pincode}</p>
        <p>You can contact them at <strong>${populated.interested_user.email}</strong> or <strong>${populated.interested_user.mobile_number}</strong>.</p>
      `,
    });
  } catch (error) {
    console.error("❌ Email sending failed:", error);
    // You can choose to continue or throw an error here based on your needs
  }

  // ✅ Final success response
  res.status(201).json(
    new Api_success(201, "Interest created successfully", populated)
  );
});

export default createInterest;


