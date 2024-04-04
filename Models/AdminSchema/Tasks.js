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
    endtime: {
        type: String,
        // required: true
    },
    starttime: {
        type: String,
        // required: true
    },
    description: {
        type: String,
        required: true
    },
    status:{
        type: String,        
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
            role:{
                type: String,
                ref: 'Technician'
            }      
        }
    ],
    assignedFrom: [
        {
            users: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Customer'
            },
            name: {
                type: String,
                ref: 'Customer'
            },
            lastName: {
                type: String,
                ref: 'Customer'
            },    
            phoneNumber: {
                type : String,
                ref: 'Customer'
            },
            email: {
                type: String,
                ref: 'Customer'
            },
            address: {
                type: String,
                ref: 'Customer'
            },
            country: {
                type: String,
                ref: 'Customer'
            },
            state: {
                type: String,
                ref: 'Customer'
            },
            city: {
                type: String,
                ref: 'Customer'
            },
            role:{
                type: String,
                ref: 'Customer'
            } 
        }
    ],

    created_date: Date,
});

const Task = mongoose.model("Task", TaskSchema);
module.exports = Task;  