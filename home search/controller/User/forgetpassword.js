import UserHome from "../../model/admin/user/user.model.js";
import asyncHandler from "../../utility/asynchandler.js";
import Api_error from "../../utility/api.error.js";
import Api_success from "../../utility/api.success.js";
import sendEmail from "../../utility/email.js";

const generatetoken = ()=>{
    return Math.floor(100000 + Math.random() * 900000);
}
 

const forgetpassworduser = asyncHandler(async(req,res)=>{
    const {email} = req.body;
    if(!email){
        throw new Api_error(400, "Email is required");
    }
    const user = await UserHome.findOne({email})
    if(!user){
        throw new Api_error(400, "Email not found, Please signup");
    }
    const token = generatetoken()
    const token_expiry = new Date(Date.now() + 5 * 60 * 1000);

    user.reset_token = token;
    user.reset_token_expires_at = token_expiry;

    await user.save();
    
    try {
    await sendEmail({
      to: email,
      subject: "Verify your identity to reset password",
      html: `
        <h2>Hello ${user.name},</h2>
        <p>Your password reset verification code is:</p>
        <h1 style="color:#2e6da4">${token}</h1>
        <p>This code will expire in 5 minutes.</p>
        <p>Please enter this code in the application to reset your password.</p>
      `,
    });

    return res.status(200).json(
      new Api_success(200, "Verification code sent to email", {
        email,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
        },
      })
    );
  } catch (error) {
    throw new Api_error(500, "Email could not be sent", error);
  }
})

export default forgetpassworduser