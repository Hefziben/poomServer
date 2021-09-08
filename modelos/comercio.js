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
            extras:{ type: String, default:'' },
            precioTotal:{ type: String, default:''},
            imagen:{ type: String },
            categoria:{ type: String },
            descripcion:{ type: String },
            disponible:{ type: Boolean, default:true },
            cantidad:{ type: Number, default:0 },
            envio:{ type: Boolean, default:true },  
            ventas:{ type: Number, default:0 },
            calificacion:{ type: Number, default:0 }, 
            isPromo:{ type: Boolean, default:false},
            comercio: { type: String,default:''},
            comercioId: { type: String,default:''},
            notificacion: { type: String,default:''},    
            validez:{ type:String, default:''},  
            ubicacion: [
                {
                    lat:{ type: Number},
                    lng:{ type: Number},
                }
                ],
                codigo:{ type: String, default:''},
                productoId:{ type: String,default:''}
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
        {   ordenNumero:{ type: String },
            orden_id:{ type: String },
            productos:[],
            usuario:{ type: Schema.Types.Mixed },         
            fecha:{ type: String },
            estado:{ type: String },
            sub_total:{ type: String },
            total:{ type: String },
            ganancia:{ type: String },
            metodo:{ type: String },
            transaccion:{ type: String },
            comprobante:{ type: String },
            comentarios:[],
         
        }
    ],
    cantidadventas:{ type: Number, default:0 },    
    imagen: { type: String },
    provincia:{ type: String,default:'Panamá'},
    isShop:{type:Boolean, default:false},
    isShopActive:{type:Boolean, default:false},
    email:{ type: String },
    website:{ type: String },
    telefono:{ type: String }
}]);

const Comercio = mongoose.model('Comercio', comercioSchema);

module.exports = Comercio;