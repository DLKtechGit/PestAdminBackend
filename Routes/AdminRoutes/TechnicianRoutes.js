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
    var result = await Technician.find({ deleted: false })
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
        let result = await Technician.findByIdAndUpdate(req.params.id, { deleted: true })
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

router.put('/deletedTechnician/:id/restore', async (req, res) => {
    try {
        await Technician.findByIdAndUpdate(req.params.id, { deleted: false });
        res.status(200).json({ message: 'Technician restored successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/totaltechnician', async (req, res) => {
    try {
        const totaltechnicians = await Technician.countDocuments({ deleted: false });
        res.status(200).json({ message: 'Total Technician Fetched Sucessfully' , totaltechnicians });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;