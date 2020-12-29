mongoose = require('mongoose');
const Schema  = mongoose.Schema;

const userSchema = new Schema(
    [{
    nombre: { type: String,  },
    imagen:{ type: String, default:'' },
    apellido:{ type: String },
    contrasena: { type: String },
    region:{ type: String },
    email:{ type: String },
    telefono:{ type: String },    
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