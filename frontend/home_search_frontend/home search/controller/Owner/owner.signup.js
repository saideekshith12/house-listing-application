import Owner from "../../model/admin/owner.model.js";
import asyncHandler from "../../utility/asynchandler.js";
import Api_error from "../../utility/api.error.js";
import Api_success from "../../utility/api.success.js";
import sendEmail from "../../utility/email.js";

// Generate 6-digit token
const generateVerificationToken = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

// Temp store (for demo)
const pendingOwner = new Map();

const ownersignup = asyncHandler(async (req, res) => {
  const { name, email, password, mobile_number } = req.body;

  // ✅ Basic Validation
  if (!name || !email || !password || !mobile_number) {
    throw new Api_error(400, "Check all the fields", [
      { field: "name", message: "name is required" },
      { field: "email", message: "email is required" },
      { field: "password", message: "password is required" },
      { field: "mobile_number", message: "mobile_number is required" },
    ]);
  }

  if (name.length < 3) {
    throw new Api_error(400, "Name must be at least 3 characters");
  }

  if (!email.endsWith("@gmail.com")) {
    throw new Api_error(400, "Email must be a gmail.com address");
  }

  if (password.length < 8) {
    throw new Api_error(400, "Password must be at least 8 characters");
  }

  // ✅ Check existing owner
  const existingOwner = await Owner.findOne({ email });
  if (existingOwner) {
    throw new Api_error(400, "Owner already exists");
  }

  // ✅ Generate and store verification token
  const verificationToken = generateVerificationToken();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minute

  pendingOwner.set(email, {
    name,
    email,
    password,
    mobile_number,
    verification_token: verificationToken,
    expires_at: expiresAt,
  });

  // ✅ Send email
  try {
    await sendEmail({
      to: email,
      subject: "Verify your email address",
      html: `
        <h2>Hello ${name},</h2>
        <p>Thank you for registering. Your verification code is:</p>
        <h1 style="color:#2e6da4">${verificationToken}</h1>
        <p>Please enter this code in the application to verify your account.</p>
      `,
    });

    return res.status(201).json(
      new Api_success(201, "Verification code sent to email", { email })
    );
  } catch (error) {
    throw new Api_error(500, "Email could not be sent", error);
  }
});

export { ownersignup, pendingOwner }; // You may want to export `pendingOwner` for verification later
