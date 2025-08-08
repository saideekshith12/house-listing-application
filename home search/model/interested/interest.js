import mongoose from "mongoose";
import UserHome from "../../model/admin/user/user.model.js";
import Owner from "../../model/admin/owner.model.js";
import House from "../admin/owner_interface/house_details.model.js";

const interestSchema = new mongoose.Schema({
    interested:{
        type: Boolean,
        default: false
    },
    created_owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Owner",
    },
    interested_user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserHome",
    },
    interested_house_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "House"
    }
})

const Interested = mongoose.model("Interested", interestSchema);
export default Interested