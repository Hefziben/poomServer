const mongoose = require('mongoose');
const Schema  = mongoose.Schema;

const comercioSchema = new Schema(
    [{
    nombre: { type: String,  },
    tipo: { type: String},
    ubicacion: [
        {
            lat:{ type: Number},
            lng:{ type: Number},
        }
        ],
    planActivo: { type: String },
    promociones:[
        {
            codigo:{ type: String }
        }
    ],
    productos:[
        {
            nombre:{ type: String },
            precio:{ type: String },
            imagen:{ type: String },
            categoria:{ type: String },
            descripcion:{ type: String },
            disponible:{ type: Boolean, default:true },
            cantidad:{ type: Number, default:0 },
            envio:{ type: Boolean, default:true },  
            ventas:{ type: Number, default:0 }          
        }
    ],
    canjes:[
        {
            promoId:{ type: String },
            usurioId:{ type: String },
            fecha:{ type: String },
        }
    ],
    ventas:[
        {   orden_id:{ type: String },
            productoId:{ type: String },
            usurioId:{ type: String },
          //comercioId:{ type: String },
            fecha:{ type: String },
            estado:{ type: String },
            confirmada:{ type: Boolean},
            total:{ type: String },
            ganancia:{ type: String },
            pagado:{ type: String },
            metodo:{ type: String },
          //impuestos:{ type: String },
        }
    ],
    cantidadventas:{ type: Number, default:0 },    
    imagen: { type: String },
    isShop:{type:Boolean, default:false},
    isShopActive:{type:Boolean, default:false},
    email:{ type: String },
    website:{ type: String },
    telefono:{ type: String }
}]);

const Comercio = mongoose.model('Comercio', comercioSchema);

module.exports = Comercio;