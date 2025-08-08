import jwt from "jsonwebtoken";
import Api_error from "../utility/api.error.js";

const isloggeduser = (req, res,next)=>{
    const token = req.cookies.token;
    if(!token){
        throw new Api_error(401, "Please Log In First");
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next()
    } catch (error) {
        throw new Api_error(401, "Invalid or expired token");
    }
}

export default isloggeduser