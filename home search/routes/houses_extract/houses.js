import rentallhouses from "../../controller/house/rent_houses_extract.js";
import { Router } from "express";
import isloggeduser from "../../middleware/islogged.user.js";
import sellallhouses from "../../controller/house/sell_houses_extract.js";
import rent_housesearch from "../../controller/house/rent_house_search.js";
import sell_housesearch from "../../controller/house/sell_house_search.js";
import createInterest from "../../controller/interest/interest_controller.js";
import  getSingleHouse from "../../controller/house/gettingsinglehouse.js";


const houseslist = Router();

houseslist.get("/rent-all-houses", isloggeduser, rentallhouses);
houseslist.get("/sell-all-houses", isloggeduser, sellallhouses);
houseslist.post("/rent-house-search", isloggeduser, rent_housesearch);
houseslist.post("/sell-house-search", isloggeduser, sell_housesearch);
houseslist.post("/create-interest/:houseid", isloggeduser, createInterest);
houseslist.get("/single-house/:houseId", isloggeduser, getSingleHouse);



export default houseslist