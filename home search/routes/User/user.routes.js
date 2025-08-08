import {signup} from "../../controller/User/signup.js";
import verify from "../../controller/User/verify.js";
import { Router } from "express";
import login from "../../controller/User/login.js";
import profile from "../../controller/User/user.profile.js";
import isloggeduser from "../../middleware/islogged.user.js";
import forgetpassworduser from "../../controller/User/forgetpassword.js";
import verifypassworduser from "../../controller/User/verify.forgot.js";
import resetpassworduser from "../../controller/User/reset.password.js";
import userlogout from "../../controller/User/user.logout.js";
import alluserinterested from "../../controller/interest/user_seen_his_interest.js";

const users = Router();

users.post("/signup", signup);
users.post("/verify", verify);
users.post("/login", login);
users.get("/profile", isloggeduser, profile);
users.post("/forget-password", forgetpassworduser);
users.post("/verify-forget-password", verifypassworduser);
users.post("/reset-password", resetpassworduser);
users.post("/logout", isloggeduser, userlogout);
users.get("/interests", isloggeduser, alluserinterested);


export default users