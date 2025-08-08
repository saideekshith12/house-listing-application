import Owner from "../../model/admin/owner.model.js";
import asyncHandler from "../../utility/asynchandler.js";
import Api_error from "../../utility/api.error.js";
import Api_success from "../../utility/api.success.js";
import { pendingOwner } from "./owner.signup.js";
import sendEmail from "../../utility/email.js";

const verifyOwner = asyncHandler(async (req, res) => {
  const { verificationToken } = req.body;

  if (!verificationToken) {
    throw new Api_error(400, "Verification token is required");
  }

  let matchedEmail = null;
  let userData = null;

  for (const [email, data] of pendingOwner.entries()) {
     if (String(data.verification_token) === String(verificationToken)) {
      matchedEmail = email;
      userData = data;
      break;
    }
  }

  if (!userData) {
    throw new Api_error(400, "Invalid verification token");
  }

  // Check token expiry
  if (new Date() > userData.expires_at) {
    pendingOwner.delete(matchedEmail);
    throw new Api_error(400, "Verification token has expired");
  }

  try {

    const owner = await Owner.create({
      name: userData.name,
      email: matchedEmail,
      password: userData.password,
      mobile_number: userData.mobile_number,
      verification_token: userData.verification_token,
      is_verified: true,
      expires_at: userData.expires_at
    });

    pendingOwner.delete(matchedEmail);

     res
      .status(201)
      .json(new Api_success(201, "Owner registered successfully", {
        owner: {
          _id: owner._id,
          name: owner.name,
          email: owner.email,
        }
      }));
      sendEmail({
      to: owner.email,
      subject: "Your account has been verified",
      html: `
        <h2>Hello ${owner.name},</h2>
        <p>Thank you for registering. Enjoy using our services.</p>
      `,
    }).catch((error)=>{
        console.error("❌ Email was not sent:", error.message);
    });
  } catch (error) {
    console.error("Error in verification:", error);
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
});

export default verifyOwner;
