import Owner from "../../model/admin/owner.model.js";
import asyncHandler from "../../utility/asynchandler.js";
import Api_error from "../../utility/api.error.js";
import Api_success  from "../../utility/api.success.js";
import sendEmail from "../../utility/email.js"; // Ensure this exists

const generateVerificationToken = () => {
  return Math.floor(100000 + Math.random() * 900000); // 6-digit token
};

const ownerForgetPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new Api_error(400, "Email is required");
  }

  const owner = await Owner.findOne({ email });

  if (!owner) {
    throw new Api_error(400, "Email not found. Please sign up first");
  }

  // Generate and assign token + expiry
  const forgot_token = generateVerificationToken();
  const forgot_token_expiry = Date.now() + 5 * 60 * 1000; // 5 minutes

  owner.reset_token = forgot_token;
  owner.reset_token_expires_at = forgot_token_expiry;

  await owner.save();

  try {
    await sendEmail({
      to: email,
      subject: "Verify your identity to reset password",
      html: `
        <h2>Hello ${owner.name},</h2>
        <p>Your password reset verification code is:</p>
        <h1 style="color:#2e6da4">${forgot_token}</h1>
        <p>This code will expire in 5 minutes.</p>
        <p>Please enter this code in the application to reset your password.</p>
      `,
    });

    return res.status(200).json(
      new Api_success(200, "Verification code sent to email", {
        email,
        owner: {
          _id: owner._id,
          name: owner.name,
          email: owner.email,
        },
      })
    );
  } catch (error) {
    throw new Api_error(500, "Email could not be sent", error);
  }
});

export default ownerForgetPassword;