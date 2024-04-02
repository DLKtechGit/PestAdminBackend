const mongoose = require('mongoose')

const qrCode = new mongoose.Schema({
    qrTitle:{
        type:String,
        required:true
    },
    serviceName:{
        type:String,
        required:true
    },
    customerName:{
        type:String,
        required:true
    },
    startDate:{
        type:String,
        required:true
    },
    time:{
        type:String,
        required:true
    },
    
    format:{
        type:String,
        required:true
    },
    width:{
        type:String,
        required:true
    },
    height:{
        type:String,
        required:true
    },
    qrImage:{
        type:String,
        
    }


})

const Qrcode = mongoose.model('QrCode',qrCode)
module.exports = Qrcode