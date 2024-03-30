const express = require('express');
const router = express.Router();
const Company = require("../../Models/AdminSchema/CompanySchema")

router.post('/createCompany', async (req, res) => {

    let { name, address, email, country, state, city, phoneNumber } = req.body

    if (!name || !address || !email || !country || !state || !city || !phoneNumber) {
        res.statusMessage = "Missing some required Data....."
        return res.status(201).json()
    }

    try {
        let CheckCompanyName = await Company.findOne({ name: name })
        if (CheckCompanyName) {
            res.status(200).json({ message: "Company Name Already Found... Try another Name" })
        } else {
            const newCompany = new Company({
                name: name,
                address: address,
                email: email,
                country: country,
                state: state,
                city: city,
                phoneNumber: phoneNumber,
                created_date: new Date,
            })
            let result = await newCompany.save()

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

router.get('/getCompany', async (req, res) => {
    var result = await Company.find({ deleted: false });
    // console.log("result====>", result);
    res.statusMessage = "Company Data fetched successfully..."
    res.status(200).json({
        Length: result.length,
        Results: result
    })
})

router.post('/customerdelete/:id', async (req, res) => {
    // console.log("req====>",req.params.id);
    if (!req.params.id) {
        res.statusMessage = "Some required missing..."
        return res.status(201).json({
            error: 'Some required missing...'
        })
    }

    try {
        let result = await Company.findByIdAndUpdate(req.params.id, { deleted: true })
        if (result) {
            res.statusMessage = "Company deleted successfully..."
            res.status(200).json({
                Results: result
            })
        }
    }

    catch (err) {
        res.statusMessage = "Company delete Failed..."
        res.status(400).json({
        })
    }
})

router.put('/deletedcompany/:id/restore', async (req, res) => {
    try {
        await Company.findByIdAndUpdate(req.params.id, { deleted: false });
        res.status(200).json({ message: 'Employee restored successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});


router.get('/totalcompany', async (req, res) => {
    try {
        const totalCustomers = await Company.countDocuments({ deleted: false });
        res.json({ totalCustomers });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;