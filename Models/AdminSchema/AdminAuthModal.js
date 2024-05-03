const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    email: { type: String, unique: true },
    password: String,
    role: String
});

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;