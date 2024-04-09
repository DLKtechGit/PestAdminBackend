const express = require('express');
const router = express.Router();
const Qrcode = require('../../Models/AdminSchema/QrcodeSchema');
const qrcode = require('../../Models/AdminSchema/TaskSchema');

router.post('/createQr', async (req, res) => {
    const { qrTitles, serviceName, customerName, startDate, time, format, width, height, numQRCodes, qrImage } = req.body;
    if (!qrTitles || !serviceName || !customerName || !startDate || !format || !width || !numQRCodes || !height) {
        return res.status(400).json({
            message: 'Missing some required data.'
        });
    }

    try {
        const existingQrcodes = await Qrcode.find({ qrTitles: { $in: qrTitles } });
        if (existingQrcodes.length > 0) {
            return res.status(409).json({
                message: 'QR code titles already exist.'
            });
        }

        const newQrcode = new Qrcode({
            qrTitles,
            serviceName,
            customerName,
            startDate,
            time,
            format,
            width,
            height,
            qrImage,
            numQRCodes,
            created_date: new Date()
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

router.get('/totalQrcodes', async (req, res) => {
    try {
      const totalQrcode = await Qrcode.countDocuments();
      res.json({ totalQrcode });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

module.exports = router;
