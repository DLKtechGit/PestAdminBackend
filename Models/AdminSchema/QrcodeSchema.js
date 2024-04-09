const mongoose = require('mongoose');

const qrCodeSchema = new mongoose.Schema({
    qrTitles: [{
        type: String,
        required: true
    }],
    serviceName: {
        type: String,
        required: true
    },
    customerName: {
        type: String,
        required: true
    },
    startDate: {
        type: String,
        required: true
    },
    time: {
        type: String,
        // required: true
    },
    format: {
        type: String,
        required: true
    },
    width: {
        type: String,
        required: true
    },
    height: {
        type: String,
        required: true
    },
    qrImage: {
        type: String,
    },

    numQRCodes: {
        type: String,
        required: true
    }
    ,
    created_date: {
        type: Date,
        default: Date.now
    }
});

const QRCode = mongoose.model('QRCode', qrCodeSchema);
module.exports = QRCode;
