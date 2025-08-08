import House from "../../model/admin/owner_interface/house_details.model.js";
import asyncHandler from "../../utility/asynchandler.js";
import Api_error from "../../utility/api.error.js";
import Api_success from "../../utility/api.success.js";

const housedetailsentry = asyncHandler(async (req, res) => {
    const {
        type, room, price, square_feet, loan,
        near_by_places, bedrooms, bathrooms, balcony,
        house_type, furnishing_status, facing,
        floor, description,
        amenities, state,
        district, area, colony,
        street, city, pincode
    } = req.body;

    const image = req.file?.filename;

    // 1️⃣ Check all fields are present and not empty
    const requiredFields = {
        type, room, price, square_feet, loan,
        near_by_places, bedrooms, bathrooms, balcony,
        house_type, furnishing_status, facing,
        floor, description,
        amenities, image, state,
        district, area, colony,
        street, city, pincode
    };

    const missingFields = Object.entries(requiredFields)
        .filter(([key, value]) => value === undefined || value === null || value === '')
        .map(([key]) => key);

    if (missingFields.length > 0) {
        throw new Api_error(400, `Missing required fields: ${missingFields.join(", ")}`);
    }

    // 2️⃣ Normalize values
    const lowerType = type.toLowerCase();
    const existing_loans = loan.toLowerCase();
    const balcony_present = balcony.toLowerCase();
    const furnishing = furnishing_status.toLowerCase();
    const states = state.toLowerCase();
    const districts = district.toLowerCase();
    const areas = area.toLowerCase();
    const colonies = colony.toLowerCase();
    const streets = street.toLowerCase();
    const cities = city.toLowerCase();

    // 3️⃣ Custom validations
    if (lowerType !== "sell" && lowerType !== "rent") {
        throw new Api_error(400, "type must be 'sell' or 'rent'");
    }
    if (existing_loans !== "yes" && existing_loans !== "no") {
        throw new Api_error(400, "loan must be 'yes' or 'no'");
    }
    if (balcony_present !== "yes" && balcony_present !== "no") {
        throw new Api_error(400, "balcony must be 'yes' or 'no'");
    }
    if (!["furnished", "semi-furnished", "unfurnished"].includes(furnishing)) {
        throw new Api_error(400, "furnishing_status must be 'furnished', 'semi-furnished', or 'unfurnished'");
    }
    if (price < 0) {
        throw new Api_error(400, "price must be greater than 0");
    }

    const imageUrl = req.file 
  ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  : null;


    // 4️⃣ Create and respond
    const newhouse = await House.create({
        type: lowerType,
        room,
        price,
        square_feet,
        loan: existing_loans,
        near_by_places,
        bedrooms,
        bathrooms,
        balcony: balcony_present,
        house_type,
        furnishing_status: furnishing,
        facing,
        floor,
        description,
        amenities,
        image:imageUrl,
        state: states,
        district: districts,
        area: areas,
        colony: colonies,
        street: streets,
        city: cities,
        pincode,
        created_by: req.owner._id,
        int_by:[]
    });

    const house = await House.findById(newhouse._id).populate([
        { path: "created_by", select: "name email mobile_number" },
        { path: "int_by", select: "interested created_owner interested_user" }
    ]);

    res.status(201).json(
        new Api_success(201, "House created successfully", { house })
    );
});

export default housedetailsentry;
