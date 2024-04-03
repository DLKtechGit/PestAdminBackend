const express = require('express');
const router = express.Router();
const CustomerAuth = require('../../Models/AdminSchema/OtherAuthModal');
const TechnicianAuth = require('../../Models/AdminSchema/TechnicianAuthModal');
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

router.get("/registeredCustomers", async (req, res) => {
    try {
        const RegisteredCustomers = await CustomerAuth.find()
        if (RegisteredCustomers?.length > 0) {
            res.status(200).json({
                success: true,
                message: 'All Registered Companies fetched Successfully',
                data: RegisteredCustomers
            })
        }
        else {
            res.status(404).json({
                success: false,
                message: 'No Registered companies found'
            })
        }
    } catch (error) {
        console.error("Error fetching Registered companies:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
})


router.post('/resetPassword', async (req, res) => {
    let { email, password, confirmpassword } = req.body;

    if (!email || !password || !confirmpassword) {
        return res.status(400).json({ message: "Email or password or confirmPassword missing" });
    }

    if (password !== confirmpassword) {
        return res.status(400).json({ message: "Password and confirmPassword do not match" });
    }

    try {
        // Find the user by email
        let user = await CustomerAuth.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

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


// technician

router.post('/technicianRegister/:id', async (req, res) => {

    try {
        const { name, email, password } = req.body;
        const { id } = req.params;
        // console.log("req----------->",req.params);
        // Check if an admin with the same email already exists
        const existingAdmin = await TechnicianAuth.findOne({ email });

        if (existingAdmin) {
            return res.status(400).json({ message: 'Techinician login already exists for this person' });
        }
        const admin = new TechnicianAuth({ name, email, password, adminId: id, created_date: new Date() });
        let result = await admin.save();

        res.status(200).json({ message: 'Techinician registered successfully', data: result });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.get("/registeredTechnician", async (req, res) => {
    try {
        const RegisteredCustomers = await TechnicianAuth.find()
        if (RegisteredCustomers?.length > 0) {
            res.status(200).json({
                success: true,
                message: 'All Registered Technician fetched Successfully',
                data: RegisteredCustomers
            })
        }
        else {
            res.status(404).json({
                success: false,
                message: 'No Registered Technician found'
            })
        }
    } catch (error) {
        // console.error("Error fetching Registered Technician:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
})


router.post('/technicianlogin', async (req, res) => {
    // console.log("Body ===>> ", req.body)
    let { email, password } = req.body

    if (!email || !password) {
        res.statusMessage = "mail/password required..."
        return res.status(201).json()
    }
    try {
        let result = await TechnicianAuth.findOne({ email: email })
        // console.log("result----->", result)
        if (email === result.email && password === result.password) {
            res.statusMessage = "LoggedIn Successfully..."
            res.status(200).json({
                data: result
            })
        }
        else {
            res.statusMessage = "Wrong Credetial... Check Again..."
            res.status(400).json()
        }
    }
    catch (err) {
        res.statusMessage = "Techinician Not Found..."
        res.status(400).json({
            error: err,
        })
    }

})


router.post('/resetPwdTechnician', async (req, res) => {
    let { email, password, confirmpassword } = req.body;

    if (!email || !password || !confirmpassword) {
        return res.status(400).json({ message: "Email or password or confirmPassword missing" });
    }

    if (password !== confirmpassword) {
        return res.status(400).json({ message: "Password and confirmPassword do not match" });
    }

    try {
        // Find the user by email
        let user = await TechnicianAuth.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
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
