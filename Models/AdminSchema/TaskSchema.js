const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    technicians: [{
        technicianId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Technician',
            required: true
        },
        technicianDetails:{
            type: String,
            ref: 'Technician',
        },
        tasks: [{
            serviceName: {
                type: String,
                required: true
            },
            companyName: {
                type: String,
                required: true
            },
            startDate: {
                type: Date,
                required: true
            },
            endtime: {
                type: Date,
                required: true
            },
            starttime: {
                type: Date,
                required: true
            },
            description: {
                type: String,
                required: true
            },
            status: {
                type: String,
                default: 'Pending'
            }
        }]
    }]
});

const Task = mongoose.model('Task', TaskSchema);

module.exports = Task;
