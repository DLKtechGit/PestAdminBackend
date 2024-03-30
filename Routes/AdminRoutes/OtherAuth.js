const express = require('express');
const router = express.Router();
const CustomerAuth = require('../../Models/AdminSchema/OtherAuthModal');

router.post('/customerRegister/:id', async (req, res) => {
    try {
        // Extract customer details and admin ID from request body and params
        const { name, email, password } = req.body;
        const { id } = req.params;

        // Create a new customer instance
        const newCustomer = new CustomerAuth({ name, email, password, adminId: id });

        // Save the customer to the database
        await newCustomer.save();

        // Respond with success message
        res.status(201).json({ message: 'Customer registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
