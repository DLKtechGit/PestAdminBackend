const express = require('express');
const router = express.Router();
const CustomerAuth = require('../../Models/AdminSchema/OtherAuthModal');
// const bcrypt = require('bcrypt');

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
});

router.post('/resetPassword', async (req, res) => {
    let { email, password, confirmPassword } = req.body;

    if (!email || !password || !confirmPassword) {
        return res.status(400).json({ message: "Email or password or confirmPassword missing" });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ message: "Password and confirmPassword do not match" });
    }

    try {
        // Find the user by email
        let user = await CustomerAuth.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Hash the new password
        // const hashedPassword = await bcrypt.hash(password, 10);

        // Update user's password
        user.password = password;
        user.modified_date = new Date();

        // Save the updated user
        await user.save();

        return res.status(200).json({ message: "Password changed successfully" });
    } catch (err) {
        console.error("Error:", err);
        return res.status(500).json({ message: "Password changing failed" });
    }
});


module.exports = router;
