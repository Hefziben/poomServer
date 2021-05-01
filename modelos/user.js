const mongoose = require('mongoose');
const Schema  = mongoose.Schema;

const userSchema = new Schema(
    [{
    nombre: { type: String,  },
    imagen:{ type: String, default:'' },
    role:{ type: String, default:'User' },
    apellido:{ type: String },
    contrasena: { type: String },
    region:{ type: String },
    email:{ type: String },
    sexo:{ type: String },
    nacimiento:{ type: String },
    telefono:{ type: String }, 
    msgToken: { type: String, default:null},   
    cupones:[{
        id:{ type: String },
        imagen:{ type: String },
        categoria:{ type: String },
        cangeado:{ type: Boolean},        
    }],
    intereses:[{
        name:{ type: String },
        selected:{ type: Boolean }        
    }]
}]);

const User = mongoose.model('User', userSchema);

module.exports = User;