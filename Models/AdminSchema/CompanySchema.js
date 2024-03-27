const mongoose = require('mongoose');

const Company = new mongoose.Schema({
    companyName: {
        type: String,
        required: true
    },  
    email: {
        type: String,
        unique : true,
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
    phoneNumber: {
        type : String,
        unique : true,
        required : true,
    },
    created_date: Date,     
});

const CompanyModels = mongoose.model("Company", Company);
module.exports = CompanyModels;