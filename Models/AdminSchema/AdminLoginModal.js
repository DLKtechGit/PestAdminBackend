const mongoose = require('mongoose');

const adminUserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
});

const AdminLoginModal = mongoose.model('AdminUser', adminUserSchema);

module.exports = AdminLoginModal;