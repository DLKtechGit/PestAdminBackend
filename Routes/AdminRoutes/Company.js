const express = require('express');
const router = express.Router();
const Company = require("../../Models/AdminSchema/CompanySchema")

router.post('/createCompany', async (req, res) => {

    let { companyName,address,country,state,city,phoneNumber } = req.body

    if (!companyName || !address || !country || !state || !city || !phoneNumber) {
        res.statusMessage = "Missing some required Data....."
        return res.status(201).json()
    }

    try {
        let CheckCompanyName = await Company.findOne({ companyName: companyName })
        if (CheckCompanyName) {          
            res.status(200).json({ message: "Company Name Already Found... Try another Name" })
        } else {
            const newCompany = new Company({
                companyName: companyName,
                address:address,
                country:country,
                state:state,
                city:city,
                phoneNumber:phoneNumber,
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
    var result = await Company.find()
    // console.log("result====>", result);
    res.statusMessage = "Company Data fetched successfully..."
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