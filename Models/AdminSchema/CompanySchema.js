const mongoose = require('mongoose');

const Company = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
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
        type: String,
        unique: true,
        required: true,
    },
    deleted: {
        type: Boolean,
        default: false
    },
    created_date: Date,
});

const CompanyModels = mongoose.model("Company", Company);
module.exports = CompanyModels;