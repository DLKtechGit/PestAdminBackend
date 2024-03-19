const mongoose = require('mongoose');

const technician = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },    
    phoneNumber: {
        type : String,
        unique : true,
        required : true,
    },
    email: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    
   
    created_date: Date,     
});

const Technician = mongoose.model("Technician", technician);
module.exports = Technician;