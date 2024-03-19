const express = require('express');
const router = express.Router();
// const user = require("../modals/Users")
const createServices = require("../../Models/AdminSchema/CreateServiceModal")

router.post('/createService', async (req, res) => {

    let { serviceName } = req.body

    if (!serviceName) {
        res.statusMessage = "Missing some required Data....."
        return res.status(201).json()
    }

    try {
        let CheckServiceName = await createServices.findOne({ serviceName: serviceName })
        if (CheckServiceName) {          
            res.status(200).json({ message: "Service Already Found... Try another Name" })
        } else {
            const newServices = new createServices({
                serviceName: serviceName,
                created_date: new Date,
            })
            let result = await newServices.save()

            if (result) {
                res.statusMessage = "New Service created Successfully..."
                res.status(200).json({
                    data: result
                })
            }
        }
    }
    catch (err) {
        res.statusMessage = "Service creation Failed..."
        res.status(400).json({
        })
    }
})

router.get('/getServices', async (req, res) => {
    var result = await createServices.find()
    // console.log("result====>", result);
    res.statusMessage = "BootSeat fetched successfully..."
    res.status(200).json({
        Length: result.length,
        Results: result
    })
})

// router.post('/deletebookseat/:id', async (req, res) => {
//     // console.log("req====>",req.params.id);
//     if (!req.params.id) {
//         res.statusMessage = "Some required missing..."
//         return res.status(201).json({
//             error: 'Some required missing...'
//         })
//     }

//     try {
//         let result = await BootSeat.findOneAndDelete({ _id: req.params.id })
//         if (result) {
//             res.statusMessage = "BootSeat deleted successfully..."
//             res.status(200).json({
//                 Results: result
//             })
//         }
//     }

//     catch (err) {
//         res.statusMessage = "BootSeat delete Failed..."
//         res.status(400).json({
//         })
//     }
// })

module.exports = router;