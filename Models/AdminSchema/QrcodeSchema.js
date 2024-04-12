const mongoose = require('mongoose');

const qrCodeSchema = new mongoose.Schema({
    qrTitle: {
        type: String,
        // required: true
    },
    titles: [{
        title: { type: String },
        // Other properties if needed
    }],
    serviceName: {
        type: String,
        // required: true
    },
    customerName: {
        type: String,
        // required: true
    },
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer', // Reference to your Customer model
        // required: true
    },
    startDate: {
        type: Date,
        // required: true
    },
    format: {
        type: String,
        // required: true
    },
    width: {
        type: Number,
        // required: true
    },
    height: {
        type: Number,
        // required: true
    },
    qrImage: {
        type: String
    },
    numQRCodes: {
        type: Number,
        // required: true
    },
    available: {
        type: String,
        default: 'NO' // Default value set to 'NO'
    },
    created_date: {
        type: Date,
        default: Date.now
    }
});

const QRCode = mongoose.model('QRCode', qrCodeSchema);
module.exports = QRCode;
