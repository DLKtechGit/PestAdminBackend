const express = require('express');
const router = express.Router();
const Technician = require("../../Models/AdminSchema/AddTechnicianSchema")
const DeletedTechnician = require("../../Models/AdminSchema/DeletedTechnician")

router.post('/createTechnician', async (req, res) => {

    let { firstName,lastName,email,address,country,state,city,phoneNumber } = req.body

    if (!firstName || !lastName || !phoneNumber || !email || !address || !country || !state || !city ) {
        res.statusMessage = "Missing some required Data....."
        return res.status(201).json()
    }

    try {
        let CheckTechnician = await Technician.findOne({ email: email })
        if (CheckTechnician) {          
            res.status(200).json({ message: "Technician Already Found... Try another Name" })
        } else {
            const newTechnician = new Technician({
                firstName: firstName,
                lastName:lastName,
                email:email,
                address:address,
                country:country,
                state:state,
                city:city,
                phoneNumber:phoneNumber,
                created_date: new Date,
            })
            let result = await newTechnician.save()

            if (result) {
                res.statusMessage = "New Technician created Successfully..."
                res.status(200).json({
                    data: result
                })
            }
        }
    }
    catch (err) {
        res.statusMessage = "Technician creation Failed..."
        res.status(400).json({
        })
    }
})

router.get('/getTechnician', async (req, res) => {
    var result = await Technician.find()
    // console.log("result====>", result);
    res.statusMessage = "Technician Data fetched successfully..."
    res.status(200).json({
        Length: result.length,
        Results: result
    })
})

router.post("/delete/:id", async (req, res) => {
    try {
      const deletedTechnician = await Technician.findByIdAndDelete(req.params.id);
      if (deletedTechnician) {
        const Technicians = new DeletedTechnician({
          technicianId: deletedTechnician._id,
          firstName: deletedTechnician.firstName,
          lastName: deletedTechnician.lastName,
          phoneNumber: deletedTechnician.phoneNumber,
          email: deletedTechnician.email,
          address: deletedTechnician.address,
          country: deletedTechnician.country,
          state: deletedTechnician.state,
          city: deletedTechnician.city,
          created_date:deletedTechnician.created_date,
        });
        await Technicians.save();
        res.status(200).json({ message: "Technician deleted successfully." });
      } else {
        res.status(404).json({ error: "Technician not found." });
      }
    } catch (error) {
      console.error("Error deleting company:", error);
      res.status(500).json({ error: "Server error" });
    }
  });

router.get("/all/deletedTechnician", async (req,res)=>{
    try {
        const DeletedTechlnicians = await DeletedTechnician.find()

        if(DeletedTechlnicians?.length > 0 )
        {
            res.status(200).json({
                success:true,
                message:'All deleted Technicians fetched Successfully',
                data:DeletedTechlnicians
            })
        }
        else{
            res.status(404).json({
                success:false,
                message:'No deleted Technicians found'
            })
        }
    } catch (error) {
        console.error("Error fetching deleted Technicians:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
    }
})
  
  // Restore a deleted company by ID
  router.post("/deletedtechnician/restore/:id", async (req, res) => {
const _id = req.params.id
    try {
      const restoredTechnician = await DeletedTechnician.findByIdAndDelete(_id);
      if (restoredTechnician) {
        const restoredTechnicians = new Technician({
            technicianId: restoredTechnician._id,
            firstName: restoredTechnician.firstName,
            lastName: restoredTechnician.lastName,
            phoneNumber: restoredTechnician.phoneNumber,
            email: restoredTechnician.email,
            address: restoredTechnician.address,
            country: restoredTechnician.country,
            state: restoredTechnician.state,
            city: restoredTechnician.city,
            created_date:restoredTechnician.created_date,
        });
        await restoredTechnicians.save();
        
        res.status(200).json({ message: "Technician restored successfully." });
      } else {
        res.status(404).json({ error: "Deleted Technicians not found." });
      }
    } catch (error) {
      console.error("Error restoring company:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  

router.get('/totaltechnician', async (req, res) => {
    try {
        const totaltechnicians = await Technician.countDocuments({ deleted: false });
        res.status(200).json({ message: 'Total Technician Fetched Sucessfully' , totaltechnicians });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;