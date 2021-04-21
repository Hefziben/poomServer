const mongoose = require('mongoose');
const Schema  = mongoose.Schema;

const adminSchema = new Schema(
    [{
    name: { type: String,  },
    password: { type: String },
    role: { type: String,default:'Admin' },
}]);

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;