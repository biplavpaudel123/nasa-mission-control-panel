const mongoose = require('mongoose');

const launchesSchema= newmongoose.Schema({
    flightNumber:{
            type :Number,
            required: true,
        } ,
    launchDate: {
            type :Date,
            required: true,
        },
    mission: {
            type :String,
            required: true,
        },
    rocket:{
            type :String,
            required: true,
        },
    target: {
        type: String,
        required: true,
    },
    customers: [String],
    upcoming: {
        type: Boolean,
        required: true,
    },
    success: {
        type: Boolean,
        required: true,
        default: true,
    },
});


//connects the launches schema to "launches" collection
module.exports=mongoose.model('Launch',launchesSchema)