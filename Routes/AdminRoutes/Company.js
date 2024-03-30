const express = require("express");
const router = express.Router();
const Company = require("../../Models/AdminSchema/CompanySchema");
const DeletedCustomer = require("../../Models/AdminSchema/DeletedCustomer");
const { route } = require("./CreateService");

router.post("/createCompany", async (req, res) => {
  
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


router.get("/getCompany", async (req, res) => {
  var result = await Company.find();
  // console.log("result====>", result);
  res.statusMessage = "Company Data fetched successfully...";
  res.status(200).json({
    Length: result.length,
    Results: result,
  });
});

router.post("/customerdelete/:id", async (req, res) => {
    try {
      const deletedCompany = await Company.findByIdAndDelete(req.params.id);
      if (deletedCompany) {
        const deletedCustomer = new DeletedCustomer({
          companyId: deletedCompany._id,
          name: deletedCompany.name,
          email: deletedCompany.email,
          address: deletedCompany.address,
          country: deletedCompany.country,
          state: deletedCompany.state,
          city: deletedCompany.city,
          phoneNumber: deletedCompany.phoneNumber,
          created_date: deletedCompany.created_date,
        });
        await deletedCustomer.save();
        res.status(200).json({ message: "Company deleted successfully." });
      } else {
        res.status(404).json({ error: "Company not found." });
      }
    } catch (error) {
      console.error("Error deleting company:", error);
      res.status(500).json({ error: "Server error" });
    }
  });

router.get("/getall/deletedcompany", async (req,res)=>{
    try {
        const DeletedCustomers = await DeletedCustomer.find()

        if(DeletedCustomers?.length > 0)
        {
            res.status(200).json({
                success:true,
                message:'All deleted Companies fetched Successfully',
                data:DeletedCustomers
            })
        }
        else{
            res.status(404).json({
                success:false,
                message:'No deleted companies found'
            })
        }
    } catch (error) {
        console.error("Error fetching deleted companies:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
    }
})
  
  // Restore a deleted company by ID
  router.post("/deletedcompany/restore/:id", async (req, res) => {
const _id = req.params.id
    try {
      const restoredCustomer = await DeletedCustomer.findByIdAndDelete(_id);
      if (restoredCustomer) {
        const restoredCompany = new Company({
          name: restoredCustomer.name,
          address: restoredCustomer.address,
          email: restoredCustomer.email,
          country: restoredCustomer.country,
          state: restoredCustomer.state,
          city: restoredCustomer.city,
          phoneNumber: restoredCustomer.phoneNumber,
          created_date: restoredCustomer.created_date,
        });
        await restoredCompany.save();
        
        res.status(200).json({ message: "Company restored successfully." });
      } else {
        res.status(404).json({ error: "Deleted company not found." });
      }
    } catch (error) {
      console.error("Error restoring company:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  

module.exports = router;

router.get('/totalcompany', async (req, res) => {
    try {
        const totalCustomers = await Company.countDocuments({ deleted: false });
        res.json({ totalCustomers });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
