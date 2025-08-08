import asyncHandler from "../../utility/asynchandler.js";
import Api_error from "../../utility/api.error.js";
import Api_success from "../../utility/api.success.js";

const ownerlogout = asyncHandler(async (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        expires: new Date(Date.now()),
    });
    res.status(200).json(new Api_success(200, "Logout successful"));
});

export default ownerlogout