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
        {   ordenNumero:{ type: String },
            orden_id:{ type: String },
            productos:[],
            comercio:{ type: Schema.Types.Mixed },
            fecha:{ type: String },
            estado:{ type: String },
            sub_total:{ type: String },
            envio:{ type: String },
            total:{ type: String },
            metodo:{ type: String },
            verificador:{ type: String },
            transaccion:{ type: String },
            comentarios:[],
        }
    ],
    intereses:[{
        name:{ type: String },
        selected:{ type: Boolean }        
    }]
}]);

const User = mongoose.model('User', userSchema);

module.exports = User;