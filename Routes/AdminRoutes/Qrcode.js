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
            qrTitle: qrTitle,
            serviceName: serviceName,
            customerName: customerName,
            startDate: startDate,
            time: time,
            width: width,
            height: height,
            qrImage: qrImage,
            format: format,
            created_date: new Date,
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

router.get("/getQrcode", async (req, res) => {
    try {
        const Qrcodes = await Qrcode.find()
        if (Qrcodes?.length > 0) {
            res.status(200).json({
                Length: Qrcodes.length,
                success: true,
                message: 'All Registered Technician fetched Successfully',
                data: Qrcodes
            })
        }
        else {
            res.status(404).json({
                success: false,
                message: 'No Registered Technician found'
            })
        }
    } catch (error) {
        console.error("Error fetching Registered Technician:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
})

router.post('/deleteQrcode/:id', async (req, res) => {
    if (!req.params.id) {
        res.statusMessage = "Some required missing..."
        return res.status(201).json({
            error: 'Some required missing...'
        })
    }

    try {
        let result = await Qrcode.findOneAndDelete({ _id: req.params.id })
        if (result) {
            res.statusMessage = "Qrcode deleted successfully..."
            res.status(200).json({
                Results: result
            })
        }
    }

    catch (err) {
        res.statusMessage = "Qrcode delete Failed..."
        res.status(400).json({
        })
    }
})

module.exports = router;
