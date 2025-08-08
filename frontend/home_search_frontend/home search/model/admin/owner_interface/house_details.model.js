import mongoose from "mongoose";


const HouseSchema = new mongoose.Schema({
    type:{
        type: String,
        required: true,
    },
    room:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    square_feet:{
        type: Number,
        required: true
    },
    loan:{
        type: String,
        required: true
    },

    near_by_places:{
        type: String,
        required: true
    },
    bedrooms:{
        type: String,
        required: true
    },
    bathrooms:{
        type: String,
        required: true
    },
    balcony:{
        type:Boolean,
        required: true
    },
    house_type:{
        type: String,
        required: true
    },
    furnishing_status:{
        type: String,
        required: true
    },
    facing:{
        type: String,
        required: true
    },
    floor:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    amenities:{
        type: String,
        required: true
    },
    image:{
        type: String,
        required: true
    },
    state:{
        type: String,
        required: true
    },
    district:{
        type: String,
        required: true
    },
    area:{
        type: String,
        required: true
    },
    colony:{
        type: String,
        required: true
    },
    street:{
        type: String,
        required: true
    },
    city:{
        type: String,
        required: true
    },
    pincode:{
        type: String,
        required: true
    },
    created_by:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Owner",
        required: true
    },
    int_by:[{
       type:mongoose.Schema.Types.ObjectId,
       ref:"Interested",
    }]
    

},
{timestamps: true});

const House = mongoose.model("House", HouseSchema);
export default House;