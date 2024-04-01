const express = require('express');
const router = express.Router();
const CustomerAuth = require('../../Models/AdminSchema/OtherAuthModal');

// router.post('/customerRegister/:id', async (req, res) => {
//     try {
//         const { name, email, password } = req.body;
//         const { id } = req.params;

//         const newCustomer = new CustomerAuth({ name, email, password, adminId: id, created_date: new Date});
//         await newCustomer.save();

//         res.status(201).json({ message: 'Customer registered successfully' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Server Error' });
//     }
// });

router.post('/customerRegister/:id', async (req, res) => {

    try {
        const { name, email, password } = req.body;
        const { id } = req.params;
        // console.log("req----------->",req.params);
        // Check if an admin with the same email already exists
        const existingAdmin = await CustomerAuth.findOne({ email });

        if (existingAdmin) {
            return res.status(400).json({ message: 'Customer login already exists for this person' });
        }

        const admin = new CustomerAuth({ name, email, password, adminId: id, created_date: new Date() });
        let result = await admin.save();

        res.status(200).json({ message: 'Customer registered successfully', data: result });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' }); 
    }
    // try {
    //     const { name, email, password } = req.body;
    //     const { id } = req.params;

    //     // Check if a customer login already exists for the specified person
    //     const existingCustomer = await CustomerAuth.findOne({ adminId: id, email });
    //     if (existingCustomer) {
    //         return res.status(400).json({ message: 'Customer login already exists for this person' });
    //     }

    //     // Create a new customer login
    //     const newCustomer = new CustomerAuth({ name, email, password, adminId: id, created_date: new Date() });
    //     await newCustomer.save();

    //     res.status(200).json({ message: 'Customer registered successfully' });
    // } catch (error) {
    //     console.error(error);
    //     res.status(500).json({ message: 'Server Error' });
    // }
});



module.exports = router;
