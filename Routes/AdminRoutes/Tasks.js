const express = require('express');
const router = express.Router();
const Task = require("../../Models/AdminSchema/TaskSchema")
const Technician = require("../../Models/AdminSchema/CompanySchema")
const Customer = require("../../Models/AdminSchema/CompanySchema")

// router.post('/createTask', async (req, res) => {
//     try {
//         const { serviceName, companyName, startDate, description, assignedTo,assignedFrom,status } = req.body;
//         // Ensure assignedTo contains valid employee IDs
//         const validEmployeeIds = await Technician.find({ _id: assignedTo,role:"Technician"})       
//         const validCustomerIds = await Customer.find({ _id: assignedFrom,role:"Customer"})       
//         if (validEmployeeIds.length === assignedTo.length) {
//             return res.status(400).json({ error: 'Invalid employee IDs provided' });
//         }
//         if (validCustomerIds.length === assignedFrom.length) {
//             return res.status(400).json({ error: 'Invalid Customer IDs provided' });
//         }
//         // var Technician = await Technician.find()
//         const task = new Task({
//             serviceName:serviceName,
//             companyName:companyName,
//             startDate:startDate,
//             startDate:startDate,
//             description:description,
//             assignedTo:validEmployeeIds,
//             assignedFrom:validCustomerIds,
//             status:status,
//             created_date: new Date
//         });
//         await task.save();
//         res.status(201).json(task);
//     } catch (error) {
//         console.error('Error creating task:', error);
//         res.status(500).json({ error: 'Server error' });
//     }
// });
// router.post('/createTask', async (req, res) => {
//     try {
//         const { technicianId, customerId, taskDetails } = req.body;

//         // Check if a task already exists for the same technician and customer
//         const existingTask = await Task.findOne({ technicianId, customerId });

//         if (existingTask) {
//             // Add the new task to the existing task array
//             existingTask.tasks.push(taskDetails);
//             await existingTask.save();
//             res.status(200).json({ message: 'Task added successfully', task: existingTask });
//         } else {
//             // Create a new task document
//             const newTask = new Task({
//                 technicianId,
//                 customerId,
//                 tasks: [taskDetails]
//             });
//             await newTask.save();
//             res.status(201).json({ message: 'Task created successfully', task: newTask });
//         }
//     } catch (error) {
//         console.error('Error creating task:', error);
//         res.status(500).json({ error: 'Server error' });
//     }
// });

// POST /createTask
// Create a new task for a technician under a specific customer
router.post('/createTask', async (req, res) => {
    try {
        const { customerId, technicianId, taskDetails } = req.body;

        // Find the existing task for the same technician and customer
        const existingTask = await Task.findOne({
            customerId: customerId,
            'technicians.technicianId': technicianId
        });

        if (existingTask) {
            // Add the new task details to the existing task
            const technicianIndex = existingTask.technicians.findIndex(t => t.technicianId.toString() === technicianId);
            existingTask.technicians[technicianIndex].tasks.push(taskDetails);
            await existingTask.save();
            res.status(200).json({ message: 'Task added successfully', task: existingTask });
        } else {
            // Create a new task document
            const customerDetails = await Customer.findById(customerId);

            const newTask = new Task({
                customerId: customerId,
                customerDetails: customerDetails,
                technicians: [{
                    technicianId: technicianId,
                    tasks: taskDetails ? [taskDetails] : []  // Only add taskDetails if it exists
                }]
            });
            const savedTask = await newTask.save();
            res.status(201).json({ message: 'Task created successfully', task: savedTask });
        }
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
router.get('/getcompletedTasks/:id', async (req, res) => {
    const technicianId = req.params.id;
    try {
        // Find tasks with status 'completed' for the specified technician ID
        const result = await Task.find({ 
            'technicians.technicianId': technicianId, 
            'technicians.tasks.status': 'completed' 
        });

        res.statusMessage = "Completed tasks fetched successfully.";
        res.status(200).json({
            Length: result.length,
            Results: result
        });
    } catch (error) {
        console.error("Error fetching completed tasks:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get('/start/taskcount', async (req, res) => {
    try {
        const startCount = await Task.countDocuments({ 'technicians.tasks.status': 'start' });

        res.status(200).json({
            start: startCount,
        });
    } catch (error) {
        console.error('Error counting tasks by status:', error);
        res.status(500).json({ error: 'Server error' });
    }
});



router.get('/ongoing/taskcount', async (req, res) => {
    try {
        const ongoingCount = await Task.countDocuments({ 'technicians.tasks.status': 'ongoing' })

        res.status(200).json({
            Ongoing: ongoingCount
        })
    } catch (error) {
        console.error('Error counting tasks by status:', error);
        res.status(500).json({ error: 'Server error' });
    }
})

router.get('/completed/taskcount', async (req, res) => {
    try {
        const CompletedTask = await Task.countDocuments({'technicians.tasks.status':'completed' })

        res.status(200).json({
            Completed: CompletedTask
        })
    } catch (error) {
        console.error('Error counting tasks by status:', error);
        res.status(500).json({ error: 'Server error' });
    }
})
module.exports = router;
