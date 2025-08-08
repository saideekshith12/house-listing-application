import { Router } from "express";
import  {ownersignup }  from "../../controller/Owner/owner.signup.js";
import verifyOwner from "../../controller/Owner/verify.signup.js";
import ownerlogin from "../../controller/Owner/owner.login.js";
import ownerprofile from "../../controller/Owner/owner.profile.js";
import islogged from "../../middleware/islogged.js";
import ownerForgetPassword from "../../controller/Owner/owner.forget.password.js";
import verifyForgetPassword from "../../controller/Owner/owner.forget.verify.js";
import  ownernewPassword  from "../../controller/Owner/owner.reset.token.js";
import housedetailsentry from "../../controller/house/entry.js";
import ownerlogout from "../../controller/Owner/owner.logout.js";
import allinterested from "../../controller/interest/interest_by.js";
import allhouses from "../../controller/Owner/owner.all.properties.js";
import owner_delete from "../../controller/Owner/owner.delete.js";
import { upload } from "../../utility/image.js";

const owners = Router();

owners .post("/signup", ownersignup);
owners.post("/verify", verifyOwner);
owners.post("/login", ownerlogin);
owners.get("/profile", islogged, ownerprofile);
owners.post("/forget-password", ownerForgetPassword);
owners.post("/verify-forget-password", verifyForgetPassword);
owners.post("/reset-password", ownernewPassword);
owners.post("/house-entry", islogged, upload.single('image'), housedetailsentry);
owners.post("/logout", islogged, ownerlogout);
owners.get("/interests", islogged, allinterested);
owners.get("/all-houses", islogged, allhouses);
owners.delete("/delete/:houseid", islogged, owner_delete);

export default owners