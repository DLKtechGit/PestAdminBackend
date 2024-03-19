const mongoose = require('mongoose');

const CreateService = new mongoose.Schema({
    serviceName: {
        type: String,
        required: true
    },    
    created_date: Date,     
});

const CreateServiceModal = mongoose.model("CreateService", CreateService);
module.exports = CreateServiceModal;