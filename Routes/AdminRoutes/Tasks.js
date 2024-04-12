const express = require("express");
const router = express.Router();
const Task = require("../../Models/AdminSchema/TaskSchema");
const Customer = require("../../Models/AdminSchema/CompanySchema");

router.post("/createTask", async (req, res) => {
  try {
    const { customerId, technicianId, taskDetails } = req.body;
    const existingTask = await Task.findOne({
      customerId: customerId,
      "technicians.technicianId": technicianId,
    });

    if (existingTask) {
      const technicianIndex = existingTask.technicians.findIndex(
        (t) => t.technicianId.toString() === technicianId
      );
      existingTask.technicians[technicianIndex].tasks.push(taskDetails);
      await existingTask.save();
      res
        .status(200)
        .json({ message: "Task added successfully", task: existingTask });
    } else {
      const customerDetails = await Customer.findById(customerId);
      const technicianDetails = await Customer.findById(technicianId);
      //   console.log("technicianDetails", technicianDetails);

      const newTask = new Task({
        customerId: customerId,
        customerDetails: customerDetails,
        technicians: [
          {
            technicianId: technicianId,
            tasks: taskDetails
              ? [{ ...taskDetails, technicianDetails: technicianDetails }]
              : [],
          },
        ],
      });
      const savedTask = await newTask.save();
      res
        .status(201)
        .json({ message: "Task created successfully", task: savedTask });
    }
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/getTasks", async (req, res) => {
  var result = await Task.find();
  // console.log("result====>", result);
  res.statusMessage = "Technician Data fetched successfully...";
  res.status(200).json({
    Length: result.length,
    Results: result,
  });
});

router.get("/getTask/:taskId", async (req, res) => {
  const taskId = req.params.taskId;

  try {
    const task = await Task.findOne({ "technicians.tasks._id": taskId });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    const specificTaskItem = task.technicians.reduce((acc, technician) => {
      const foundTask = technician.tasks.find(task => task._id == taskId);
      return foundTask ? foundTask : acc;
    }, null);

    if (!specificTaskItem) {
      return res.status(404).json({ message: "Task item not found" });
    }

    res.status(200).json({ task: specificTaskItem });
  } catch (error) {
    console.error("Error fetching task item:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/getcompletedTasks", async (req, res) => {
  const { technicianId } = req.body;
  try {
    const result = await Task.find({
      "technicians.tasks.status": "completed",
      "technicians.technicianId": technicianId,
    }).populate("technicians.tasks");

    res.statusMessage = "Completed tasks fetched successfully.";
    res.status(200).json({
      Length: result.length,
      Results: result,
    });
  } catch (error) {
    console.error("Error fetching completed tasks:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/updateTaskOtherTechnicianName", async (req, res) => {
  try {
    const { taskId, taskItemId, otherTechnicianName } = req.body;

    console.log("Received taskId:", taskId);
    console.log("Received taskItemId:", taskItemId);

    const task = await Task.findById(taskId);

    // console.log("Found task:", task);

    if (!task) {
      console.log("Task not found");
      return res.status(404).json({ error: "Task not found" });
    }

    const taskItem = task.technicians
      .flatMap((technician) => technician.tasks)
      .find((task) => task._id.toString() === taskItemId);

    if (!taskItem) {
      console.log("Task item not found");
      return res.status(404).json({ error: "Task item not found" });
    }

    taskItem.otherTechnicianName = otherTechnicianName;

    const updatedTask = await task.save();

    res.status(200).json({
      message: "Other technician name updated successfully",
      task: updatedTask,
    });
  } catch (error) {
    console.error("Error updating other technician name:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/updateTaskStatus", async (req, res) => {
  try {
    const {
      taskItemId,
      taskId,
      status,
      technicianStartDate,
      technicianStartTime,
      pauseReason,
      completedDetails,
    } = req.body;
    const taskToUpdate = await Task.findOne({
      _id: taskId,
      "technicians.tasks._id": taskItemId,
    });

    if (!taskToUpdate) {
      return res.status(404).json({ error: "Task not found" });
    }

    const technicianIndex = taskToUpdate.technicians.findIndex((tech) =>
      tech.tasks.some((task) => task._id.equals(taskItemId))
    );

    if (technicianIndex === -1) {
      return res.status(404).json({ error: "Task not found" });
    }

    const taskIndex = taskToUpdate.technicians[technicianIndex].tasks.findIndex(
      (task) => task._id.equals(taskItemId)
    );

    if (taskIndex === -1) {
      return res.status(404).json({ error: "Task not found" });
    }

    taskToUpdate.technicians[technicianIndex].tasks[taskIndex].status = status;
    taskToUpdate.technicians[technicianIndex].tasks[
      taskIndex
    ].technicianStartDate = technicianStartDate;
    taskToUpdate.technicians[technicianIndex].tasks[
      taskIndex
    ].technicianStartTime = technicianStartTime;
    taskToUpdate.technicians[technicianIndex].tasks[taskIndex].pauseReason =
      pauseReason;

    await taskToUpdate.save();

    res.status(200).json({
      message: "Task status and completed details updated successfully",
      updatedTask: taskToUpdate,
    });
  } catch (error) {
    console.error("Error updating task status:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/updateCompletedStatus", async (req, res) => {
  try {
    const { taskItemId, taskId, status, completedDetails } = req.body;
    const taskToUpdate = await Task.findOne({
      _id: taskId,
      "technicians.tasks._id": taskItemId,
    });

    if (!taskToUpdate) {
      return res.status(404).json({ error: "Task not found" });
    }

    const technicianIndex = taskToUpdate.technicians.findIndex((tech) =>
      tech.tasks.some((task) => task._id.equals(taskItemId))
    );

    if (technicianIndex === -1) {
      return res.status(404).json({ error: "Task not found" });
    }

    const taskIndex = taskToUpdate.technicians[technicianIndex].tasks.findIndex(
      (task) => task._id.equals(taskItemId)
    );

    if (taskIndex === -1) {
      return res.status(404).json({ error: "Task not found" });
    }

    taskToUpdate.technicians[technicianIndex].tasks[taskIndex].status = status;
    // Update completedDetails
    taskToUpdate.technicians[technicianIndex].tasks[
      taskIndex
    ].completedDetails = {
      chemicalsName: completedDetails.chemicalsName,
      recommendation: completedDetails.recommendation,
      techSign: completedDetails.techSign,
      customerAvailble: completedDetails.customerAvailble,
      customerSign: completedDetails.customerSign,
    };

    await taskToUpdate.save();

    res.status(200).json({
      message: "Task status and completed details updated successfully",
      updatedTask: taskToUpdate,
    });
  } catch (error) {
    console.error("Error updating task status:", error);
    res.status(500).json({ error: "Server error" });
  }
});



// router.post("/updateTaskStatus", async (req, res) => {
//     try {
//       const { taskItemId, taskId, status, technicianStartDate, technicianStartTime,pauseReason } = req.body;
//       const taskToUpdate = await Task.findOne({
//         _id: taskId,
//         "technicians.tasks._id": taskItemId,
//       });

//       if (!taskToUpdate) {
//         return res.status(404).json({ error: "Task not found" });
//       }
//       const technicianIndex = taskToUpdate.technicians.findIndex((tech) =>
//         tech.tasks.some((task) => task._id.equals(taskItemId))
//       );

//       if (technicianIndex === -1) {
//         return res.status(404).json({ error: "Task not found" });
//       }
//       const taskIndex = taskToUpdate.technicians[technicianIndex].tasks.findIndex(
//         (task) => task._id.equals(taskItemId)
//       );

//       if (taskIndex === -1) {
//         return res.status(404).json({ error: "Task not found" });
//       }
//       taskToUpdate.technicians[technicianIndex].tasks[taskIndex].status = status;
//       taskToUpdate.technicians[technicianIndex].tasks[taskIndex].technicianStartDate = technicianStartDate;
//       taskToUpdate.technicians[technicianIndex].tasks[taskIndex].technicianStartTime = technicianStartTime;
//       taskToUpdate.technicians[technicianIndex].tasks[taskIndex].pauseReason = pauseReason;

//       await taskToUpdate.save();

//       res.status(200).json({
//         message: "Task status updated successfully",
//         updatedTask: taskToUpdate,
//       });
//     } catch (error) {
//       console.error("Error updating task status:", error);
//       res.status(500).json({ error: "Server error" });
//     }
//   });

router.get("/start/taskcount", async (req, res) => {
  try {
    const startCount = await Task.countDocuments({
      "technicians.tasks.status": "start",
    });

    res.status(200).json({
      start: startCount,
    });
  } catch (error) {
    console.error("Error counting tasks by status:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/ongoing/taskcount", async (req, res) => {
  try {
    const ongoingCount = await Task.countDocuments({
      "technicians.tasks.status": "ongoing",
    });

    res.status(200).json({
      Ongoing: ongoingCount,
    });
  } catch (error) {
    console.error("Error counting tasks by status:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/completed/taskcount", async (req, res) => {
  try {
    const CompletedTask = await Task.countDocuments({
      "technicians.tasks.status": "completed",
    });

    res.status(200).json({
      Completed: CompletedTask,
    });
  } catch (error) {
    console.error("Error counting tasks by status:", error);
    res.status(500).json({ error: "Server error" });
  }
});
module.exports = router;
