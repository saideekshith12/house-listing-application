import Owner from "../../model/admin/owner.model.js";
import asynchandler from "../../utility/asynchandler.js";
import bcrypt from "bcryptjs";
import Api_error from "../../utility/api.error.js";
import Api_success from "../../utility/api.success.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

const ownerlogin = asynchandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new Api_error(400, "Check all the fields", [
      { field: "email", message: "email is required" },
      { field: "password", message: "password is required" },
    ]);
  }

  const owner = await Owner.findOne({ email });

  if (!owner) {
    throw new Api_error(400, "Email not found, Please signup first");
  }

  const passwordMatch = await bcrypt.compare(password, owner.password);
  if (!passwordMatch) {
    throw new Api_error(400, "Password is incorrect");
  }

  const token = jwt.sign(
    {
      _id: owner._id,
      name: owner.name,
      email: owner.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

res.cookie('token', token, {
  httpOnly: true,
  maxAge: 24 * 60 * 60 * 1000, // 1 day
  sameSite: 'Lax',             // ✅ recommended for local dev
  secure: false                // ✅ should be true only in HTTPS (prod)
})

  res.status(200).json(
    new Api_success(200, "You are logged in successfully", {
      owner: {
        _id: owner._id,
        name: owner.name,
        email: owner.email,
      },
    })
  );
});

export default ownerlogin;
