import Owner from "../../model/admin/owner.model.js";
import asyncHandler from "../../utility/asynchandler.js";
import Api_error from "../../utility/api.error.js";
import Api_success from "../../utility/api.success.js";

const ownernewPassword = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new Api_error(400, "Check all the fields", [
      { field: "email", message: "email is required" },
      { field: "password", message: "password is required" },
    ]);
  }

  const owner = await Owner.findOne({ email });

  if (!owner) {
    throw new Api_error(400, "Email not found. Please sign up first");
  }


  // Update password and clear reset token fields
  owner.password = password;
  owner.reset_token = undefined;
  owner.reset_token_expires_at = undefined;

  await owner.save();

  res.status(200).json(new Api_success(200, "Password updated successfully"));
});

export default ownernewPassword;