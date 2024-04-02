const express = require('express');
const router = express.Router();
const Qrcode = require('../../Models/AdminSchema/QrcodeSchema');

router.post('/create/qr', async (req, res) => {
    const { qrTitle, serviceName, customerName, startDate, time, format, width, height, qrImage } = req.body;

    
    if (!qrTitle || !serviceName || !customerName || !startDate || !time || !format || !width || !height) {
        return res.status(400).json({
            message: 'Missing some required data.'
        });
    }

    try {
        
        const existingQrcode = await Qrcode.findOne({ qrTitle });
        if (existingQrcode) {
            return res.status(409).json({
                message: 'QR code already exists.'
            });
        }

        
        const newQrcode = new Qrcode({
            qrTitle:qrTitle,
            serviceName:serviceName,
            customerName:customerName,
            startDate:startDate,
            time:time,
            width:width,
            height:height,
            qrImage:qrImage,
            format:format,
        });

       
        const savedQrcode = await newQrcode.save();

        res.status(201).json({
            message: 'QR code created successfully.',
            data: savedQrcode
        });
    } catch (error) {
        console.error('Error creating QR code:', error);
        res.status(500).json({
            message: 'Internal server error.'
        });
    }
});

module.exports = router;
