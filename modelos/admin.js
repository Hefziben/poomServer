mongoose = require('mongoose');
const Schema  = mongoose.Schema;

const adminSchema = new Schema(
    [{
    nombre: { type: String,  },
    contrasena: { type: String,  },
}]);

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;