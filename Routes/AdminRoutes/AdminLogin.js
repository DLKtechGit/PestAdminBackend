const express = require('express');
const router = express.Router();
const AdminUser = require('../../Models/AdminSchema/AdminLoginModal');

router.post('/createDefaultAdmin', async (req, res) => {
    try {
        const admin = new AdminUser({
            email: 'pestadmin@gmail.com', 
            password: '123456',
        });
        await admin.save();
        if (admin.email === req.body.email && admin.password === req.body.password) {
            res.status(200).json({message:"Admin LoggedIn successfully"})            
        } else {
            res.status(400).json({message:"Wrong Credential... Check Again..."})
        }
    } catch (error) {
        console.error(error);
        res.status(403).json({ message: 'User Already Exists' });
    }
});

router.get('/getAdminLogin', async (req, res) => {
    var result = await AdminUser.find()
    // console.log("result====>", result);
    res.statusMessage = "AdminLogin fetched successfully..."
    res.status(200).json({
        Length: result.length,
        Results: result
    })
})

module.exports = router;