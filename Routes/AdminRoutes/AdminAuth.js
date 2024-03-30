const express = require('express');
const router = express.Router();
const Admin = require('../../Models/AdminSchema/AdminAuthModal');

router.post('/register/superadmin', async (req, res) => {
    try {
        // Check if super admin already exists
        const existingSuperAdmin = await Admin.findOne({ role: 'superadmin' });
        if (existingSuperAdmin) {
            return res.status(400).json({ message: 'Super admin already exists' });
        }

        const { email, password } = req.body;
        // Create super admin
        const superAdmin = new Admin({ email, password, role: 'superadmin' });
        await superAdmin.save();

        res.status(200).json({ message: 'Super admin registered successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Admin registration
router.post('/registeradmin', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if an admin with the same email already exists
        const existingAdmin = await Admin.findOne({ email });

        if (existingAdmin) {
            return res.status(400).json({ message: 'An admin with this email already exists' });
        }

        // Check the number of existing admins
        const adminCount = await Admin.countDocuments({ role: 'admin' });

        if (adminCount >= 4) {
            return res.status(400).json({ message: 'Maximum admin limit reached' });
        }

        // Create a new admin
        const admin = new Admin({ email, password, role: 'admin' });
        let result = await admin.save();

        res.status(200).json({ message: 'Admin registered successfully', data: result });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
});


router.post('/login/admin', async (req, res) => {
    try {
        const { email, password } = req.body;
        // Find admin by email
        const admin = await Admin.findOne({ email });

        // If admin not found
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        // Check if password matches
        if (admin.password !== password) {
            return res.status(401).json({ message: 'Incorrect password' });
        }

        // If login successful
        res.status(200).json({ message: 'Admin logged in successfully', admin });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Super admin login
router.post('/login/superadmin', async (req, res) => {
    // Logic for super admin login
});

router.get('/getAllAdmins', async (req, res) => {
    var result = await Admin.find();
    // console.log("result====>", result);
    res.statusMessage = "Company Data fetched successfully..."
    res.status(200).json({
        Length: result.length,
        Results: result
    })
})


router.post('/admindelete/:id', async (req, res) => {
    // console.log("req====>",req.params.id);
    if (!req.params.id) {
        res.statusMessage = "Some required missing..."
        return res.status(201).json({
            error: 'Some required missing...'
        })
    }

    try {
        let result = await Admin.findOneAndDelete({ _id: req.params.id })
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