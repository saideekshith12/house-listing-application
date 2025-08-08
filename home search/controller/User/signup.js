import UserHome from "../../model/admin/user/user.model.js";
import asyncHandler from "../../utility/asynchandler.js";
import Api_error from "../../utility/api.error.js";
import Api_success from "../../utility/api.success.js";
import sendEmail from "../../utility/email.js";

const generateVerificationToken = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

const pendingUsers= new Map();

const signup = asyncHandler(async(req,res)=>{
    const { name, email, password, mobile_number } = req.body;
    if(!name || !email || !password || !mobile_number){
        throw new Api_error(400, "Check all the fields", [
            { field: "name", message: "name is required" },
            { field: "email", message: "email is required" },
            { field: "password", message: "password is required" },
            { field: "mobile_number", message: "mobile_number is required" },
          ]);
    }
    if(name.length<3){
        throw new Api_error(400, "Name must be at least 3 characters");
    }
    if(!email.endsWith("@gmail.com")){
        throw new Api_error(400, "Email must be a gmail.com address");
    }
    if(password.length<8){
        throw new Api_error(400, "Password must be at least 8 characters");
    }
    const existingUser = await UserHome.findOne({email});
    if(existingUser){
        throw new Api_error(400, "User already exists");
    }
    const token = generateVerificationToken();
        if(!token){
            throw new Api_error(500, "Sorry Token is not generated, Kindly Try Again");
        }
 
    const tokenExpiresAt = new Date(Date.now() + 5 * 60 * 1000);

    pendingUsers.set(email, {
        name,
        email,
        password,
        mobile_number,
        verification_token:token,
        expires_at:tokenExpiresAt,
        is_verified:false
    })
    try {
    await sendEmail({
      to: email,
      subject: "Verify your email address",
      html: `
        <h2>Hello ${name},</h2>
        <p>Thank you for registering. Your verification code is:</p>
        <h1 style="color:#2e6da4">${token}</h1>
      `,
    });

    return res.status(201).json(
      new Api_success(201, "Verification code sent to email", { email })
    );
  } catch (error) {
    throw new Api_error(500, "Email could not be sent", error);
  }
})

export {signup , pendingUsers}