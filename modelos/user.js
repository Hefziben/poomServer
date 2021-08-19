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
    otp:{ type: String, default:''},
    cupones:[{
        id:{ type: String },
        imagen:{ type: String },
        categoria:{ type: String },
        cangeado:{ type: Boolean},        
    }],
    compras:[
        {   orden_id:{ type: String },
            productoId:{ type: String },
            comercioId:{ type: String },
            fecha:{ type: String },
            estado:{ type: String },
            confirmada:{ type: Boolean},
            sub_total:{ type: String },
            envio:{ type: String },
            total:{ type: String },
            metodo:{ type: String },
        }
    ],
    intereses:[{
        name:{ type: String },
        selected:{ type: Boolean }        
    }]
}]);

const User = mongoose.model('User', userSchema);

module.exports = User;