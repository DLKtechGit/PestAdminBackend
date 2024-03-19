const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({

    serviceName: {
        type: String,
        // required: true
    },
    companyName: {
        type: String,
        // required: true
    },
    startDate: {
        type: String,
        // required: true
    },
    description: {
        type: String,
        required: true
    },
    status:{
        type: String,
        required: true
    },
    assignedTo: [
        {
            users: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Technician'
            },
            firstName: {
                type: String,
                ref: 'Technician'
            },
            lastName: {
                type: String,
                ref: 'Technician'
            },    
            phoneNumber: {
                type : String,
                ref: 'Technician'
            },
            email: {
                type: String,
                ref: 'Technician'
            },
            address: {
                type: String,
                ref: 'Technician'
            },
            country: {
                type: String,
                ref: 'Technician'
            },
            state: {
                type: String,
                ref: 'Technician'
            },
            city: {
                type: String,
                ref: 'Technician'
            },
        }
    ],
    

    created_date: Date,
});

const Task = mongoose.model("Task", TaskSchema);
module.exports = Task;  