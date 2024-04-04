const express = require('express');
const router = express.Router();
const Auth = require('../../Models/AdminSchema/CompanySchema');
const TechnicianAuth = require('../../Models/AdminSchema/AddTechnicianSchema');
const OtherAuthModal = require('../../Models/AdminSchema/OtherAuthModal')
// const bcrypt = require('bcrypt');

router.post('/register', async (req, res) => {

    try {
        const { name, email, password, role } = req.body;
        const { id } = req.params;
        const existingAdmin = await Auth.findOneAndUpdate({ email }, { $set: { password, role, registered: true } });

        res.status(200).json({ message: 'Customer registered successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.get("/GetregisteredCustomers", async (req, res) => {
    // console.log("res==============>",req);
    try {
        const RegisteredCustomers = await Auth.find({ registered: true, role: "Customer",deleted:false })
        console.log("RegisteredCustomers", RegisteredCustomers);
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
        let user = await Auth.findOne({ email });

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
router.post('/login', async (req, res) => {
    let { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required." });
    }

    try {
        let result = await Auth.findOne({ email: email });
        if (!result) {
            return res.status(400).json({ message: "Technician not found." });
        }

        if (password !== result.password) {
            return res.status(400).json({ message: "Incorrect password." });
        }

        // Assuming role is stored in the result
        res.status(200).json({ status: 200, result: result });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error." });
    }
});


// router.post('/technicianRegister', async (req, res) => {

//     try {
//         const { email, password, role } = req.body;
//         const existingAdmin = await TechnicianAuth.findOneAndUpdate({ email }, { $set: { password, role, registered: true } });

//         res.status(200).json({ message: 'Technician registered successfully' });
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).json({ message: 'Server Error' });
//     }

    
// });

router.get("/getregisteredTechnician", async (req, res) => {
    try {
        const RegisteredCustomers = await Auth.find({ registered: true ,role:"Technician"})
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



// router.post('/resetPwdTechnician', async (req, res) => {
//     let { email, password, confirmpassword } = req.body;

//     if (!email || !password || !confirmpassword) {
//         return res.status(400).json({ message: "Email or password or confirmPassword missing" });
//     }

//     if (password !== confirmpassword) {
//         return res.status(400).json({ message: "Password and confirmPassword do not match" });
//     }

//     try {
//         // Find the user by email
//         let user = await TechnicianAuth.findOne({ email });

//         if (!user) {
//             return res.status(404).json({ message: "User not found" });
//         }
//         user.password = password;
//         user.modified_date = new Date();

//         // Save the updated user
//         await user.save();

//         return res.status(200).json({ message: "Password changed successfully" });
//     } catch (err) {
//         console.error("Error:", err);
//         return res.status(500).json({ message: "Password changing failed" });
//     }
// });

module.exports = router;
