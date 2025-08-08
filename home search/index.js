import express from "express";
import dotenv from "dotenv";
import db from "./database/db.js";
import cors from "cors";
import owners from "./routes/owner/owner.route.js";
import cookieParser from "cookie-parser";
import users from "./routes/User/user.routes.js";
import houseslist from "./routes/houses_extract/houses.js";
import globalErrorHandler from "./middleware/eroorhandle.js";
import ratelimit from "express-rate-limit";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
    path: "./.env"
});

const app = express();
const PORT = process.env.PORT || 8000;
const limiter = ratelimit({
    windowMs: 1 * 60 * 1000, 
    max: 50,
    message: "Too many requests from this IP, please try again after 1 minute",
    standardHeaders: true,
    legacyHeaders: false,

})


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: "https://home-listing-application.vercel.app",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(cookieParser());
app.use('/images', express.static(path.join(__dirname, 'public/uploads')));

app.use(limiter);

app.use("/owner", owners);
app.use("/user", users);
app.use("/houses", houseslist);

app.use(globalErrorHandler);

(async () => {
    try {
        await db();
        app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
})();

