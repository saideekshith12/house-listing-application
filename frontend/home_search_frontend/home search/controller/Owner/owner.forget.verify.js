import Owner from "../../model/admin/owner.model.js";
import asyncHandler from "../../utility/asynchandler.js";
import Api_error from "../../utility/api.error.js";
import Api_success from "../../utility/api.success.js";

const verifyForgetPassword = asyncHandler(async (req, res) => {
  const { token } = req.body;

  if (!token) {
    throw new Api_error(400, "Token is required");
  }
    if(token.length !== 6){
    throw new Api_error(400, "Token should be 6 digits");
  }

  const owner = await Owner.findOne({ reset_token: token });

  if (!owner) {
    throw new Api_error(400, "Sorry there is no user with this email , please signup");
  }

  if (Date.now() > owner.reset_token_expires_at) {
    throw new Api_error(400, "Token has expired");
  }

  res.status(200).json(
    new Api_success(200, "Token is valid", {
      owner: {
        _id: owner._id,
        name: owner.name,
        email: owner.email,
      },
    })
  );
});

export default verifyForgetPassword;