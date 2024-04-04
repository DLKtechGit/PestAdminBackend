const express = require('express');
const router = express.Router();
const Task = require("../../Models/AdminSchema/Tasks")
const Technician = require("../../Models/AdminSchema/AddTechnicianSchema")

router.post('/createTask', async (req, res) => {
    try {
        const { serviceName, companyName, startDate, description, assignedTo,status } = req.body;
        // Ensure assignedTo contains valid employee IDs
        const validEmployeeIds = await Technician.find({ _id: assignedTo})       
        if (validEmployeeIds.length === assignedTo.length) {
            return res.status(400).json({ error: 'Invalid employee IDs provided' });
        }
        // var Technician = await Technician.find()
        const task = new Task({
            serviceName:serviceName,
            companyName:companyName,
            startDate:startDate,
            startDate:startDate,
            description:description,
            assignedTo:validEmployeeIds,
            status:status,
            created_date: new Date
        });
        await task.save();
        res.status(201).json(task);
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ error: 'Server error' });
    }
});


router.get('/getTasks', async (req, res) => {
    var result = await Task.find()
    // console.log("result====>", result);
    res.statusMessage = "Technician Data fetched successfully..."
    res.status(200).json({
        Length: result.length,
        Results: result
    })
})

router.get('/start/taskcount', async (req, res) => {
    try {
        const startCount = await Task.countDocuments({ status: 'start' });
       
        res.status(200).json({
            start: startCount,
        });
    } catch (error) {
        console.error('Error counting tasks by status:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/ongoing/taskcount',async(req,res)=>{
try {
    const ongoingCount = await Task.countDocuments({status:'ongoing'})

    res.status(200).json({
        Ongoing:ongoingCount
    })
} catch (error) {
    console.error('Error counting tasks by status:', error);
        res.status(500).json({ error: 'Server error' });
}
})

router.get('/completed/taskcount', async(req,res)=>{
    try {
        const CompletedTask = await Task.countDocuments({status:'completed'})

        res.status(200).json({
            Completed:CompletedTask
        })
    } catch (error) {
         console.error('Error counting tasks by status:', error);
        res.status(500).json({ error: 'Server error' });
    }
})
module.exports = router;