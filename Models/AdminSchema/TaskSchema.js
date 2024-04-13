const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        // required: true
    },
    customerDetails: {
        name: {
            type: String,
            // required: true
        },
        email: {
            type: String,
            // unique: true,
            // required: true
        },
        phoneNumber: {
            type: String,
            unique: true,
            // required: true,
        },
        address: {
            type: String,
            // required: true
        },
        country: {
            type: String,
            // required: true
        },
        state: {
            type: String,
            // required: true
        },
        city: {
            type: String,
            // required: true
        },
    },
    technicians: [{
        technicianId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Technician',
            // required: true
        },
       
        tasks: [{
            technicianDetails: {
                firstName: {
                    type: String,
                    // required: true
                },
                lastName: {
                    type: String,
                    // required: true
                },
                email:{
                    type: String,
                }               
            },
            otherTechnicianName:{
                type: String,
            },
            serviceName: {
                type: String,
                // required: true
            },
            companyName: {
                type: String,
                // required: true
            },
            technicianStartDate:{
                type: Date,
            },
            technicianStartTime:{
                type: String,
            },
            pauseReason:{
                type: String,
            },
            startDate: {
                type: Date,
                // required: true
            },
            starttime: {
                type: Date,
                // required: true
            },
            endtime: {
                type: Date,
                // required: true
            },
            description: {
                type: String,
                // required: true
            },
            status: {
                type: String,
                default: 'Yet to Start'
            },
            numQRCodes: {
                type: Number,
            }, 
            available: {
                type: String,
                default: 'NO' 
            },
            completedDetails: {
                chemicalsName: [{
                    type: String,
                    default: "No Chemaical name"
                }],
                recommendation: {
                    type: String,
                },              
                firstName: {
                    type: String,
                },
                lastName: {
                    type: String,
                },
                techSign:{
                    type: String,
                    // default:"Not Signed"
                },
                name:{
                    type: String,
                },
                customerAvailble:{
                    type: String,
                    default:"false"
                },
                customerSign:{
                    type: String,
                    // default:"Not Signed"
                },   
                endTime:{
                    type: String,
                },        
            },
        }]
    }]
});

const Task = mongoose.model('Task', TaskSchema);

module.exports = Task;
