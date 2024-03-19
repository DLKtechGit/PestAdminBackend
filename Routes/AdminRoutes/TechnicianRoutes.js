const express = require('express');
const router = express.Router();
const Technician = require("../../Models/AdminSchema/AddTechnicianSchema")

router.post('/createTechnician', async (req, res) => {

    let { firstName,lastName,email,address,country,state,city,phoneNumber } = req.body

    if (!firstName || !lastName || !phoneNumber || !email || !address || !country || !state || !city ) {
        res.statusMessage = "Missing some required Data....."
        return res.status(201).json()
    }

    try {
        let CheckTechnician = await Technician.findOne({ email: email })
        if (CheckTechnician) {          
            res.status(200).json({ message: "Technician Already Found... Try another Name" })
        } else {
            const newTechnician = new Technician({
                firstName: firstName,
                lastName:lastName,
                email:email,
                address:address,
                country:country,
                state:state,
                city:city,
                phoneNumber:phoneNumber,
                created_date: new Date,
            })
            let result = await newTechnician.save()

            if (result) {
                res.statusMessage = "New Technician created Successfully..."
                res.status(200).json({
                    data: result
                })
            }
        }
    }
    catch (err) {
        res.statusMessage = "Technician creation Failed..."
        res.status(400).json({
        })
    }
})

router.get('/getTechnician', async (req, res) => {
    var result = await Technician.find()
    // console.log("result====>", result);
    res.statusMessage = "Technician Data fetched successfully..."
    res.status(200).json({
        Length: result.length,
        Results: result
    })
})

router.post('/deleteTechnician/:id', async (req, res) => {
    // console.log("req====>",req.params.id);
    if (!req.params.id) {
        res.statusMessage = "Some required missing..."
        return res.status(201).json({
            error: 'Some required missing...'
        })
    }

    try {
        let result = await Technician.findOneAndDelete({ _id: req.params.id })
        if (result) {
            res.statusMessage = "Technician deleted successfully..."
            res.status(200).json({
                Results: result
            })
        }
    }

    catch (err) {
        res.statusMessage = "Technician delete Failed..."
        res.status(400).json({
        })
    }
})

module.exports = router;