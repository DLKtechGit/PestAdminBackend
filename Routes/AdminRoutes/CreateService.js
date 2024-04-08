const express = require('express');
const router = express.Router();
const multer = require('multer')
const path = require('path')
const createServices = require("../../Models/AdminSchema/CreateServiceModal")

let FileContent = ''

const DIR = './uploads/';
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        // console.log("filename", fileName)
        const public = path.join(__dirname, "..", 'uploads', fileName);
        FileContent = public
        cb(null, fileName)
    }
});
var upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
});

router.post('/createService', upload.single('serviceImage'), async (req, res) => {
    const { serviceName } = req.body;
    const serviceImage = req.file;

    try {
        if (!serviceName || !serviceImage) {
            return res.status(400).json({ error: "Missing required data" });
        }

        let checkServiceName = await createServices.findOne({ serviceName: serviceName });
        if (checkServiceName) {          
            return res.status(403).json({ message: "Service already exists. Please choose another name." });
        }

        const newService = new createServices({
            serviceName: serviceName,
            serviceImage: serviceImage.filename,
            created_date: new Date(),
        });

        let result = await newService.save();

        if (result) {
            return res.status(200).json({ message: "New service created successfully", data: result });
        }
    } catch (error) {
        console.error("Service creation failed:", error);
        return res.status(500).json({ error: "Server error" });
    }
});

// router.post('/createService', async (req, res) => {

//     let { serviceName } = req.body

//     if (!serviceName ) {
//         res.statusMessage = "Missing some required Data....."
//         return res.status(201).json()
//     }

//     try {
//         let CheckServiceName = await createServices.findOne({ serviceName: serviceName })
//         if (CheckServiceName) {          
//             res.status(403).json({ message: "Service Already Found... Try another Name" })
//         } else {
//             const newServices = new createServices({
//                 serviceName: serviceName,
//                 created_date: new Date,
//             })
//             let result = await newServices.save()

//             if (result) {
//                 res.statusMessage = "New Service created Successfully..."
//                 res.status(200).json({
//                     data: result
//                 })
//             }
//         }
//     }
//     catch (err) {
//         res.statusMessage = "Service creation Failed..."
//         res.status(400).json({
//         })
//     }
// })

router.get('/getServices', async (req, res) => {
    var result = await createServices.find()
    // console.log("result====>", result);
    res.statusMessage = "BootSeat fetched successfully..."
    res.status(200).json({
        Length: result.length,
        Results: result
    })
})

router.post('/deleteservices/:id', async (req, res) => {
    // console.log("req====>",req.params.id);
    if (!req.params.id) {
        res.statusMessage = "Some required missing..."
        return res.status(201).json({
            error: 'Some required missing...'
        })
    }

    try {
        let result = await createServices.findOneAndDelete({ _id: req.params.id })
        if (result) {
            res.statusMessage = "Service deleted successfully..."
            res.status(200).json({
                Results: result
            })
        }
    }

    catch (err) {
        res.statusMessage = "Service delete Failed..."
        res.status(400).json({
        })
    }
})

module.exports = router;