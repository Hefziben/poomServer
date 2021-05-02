const  mongoose = require('mongoose');
const Schema  = mongoose.Schema;

const promoSchema = new Schema(
    [{
    comercio: { type: String,default:''},
    categoria:{ type: String,default:''},
    imagen: { type: String,default:''},
    notificacion: { type: String,default:''},
    validez:{ type:String, default:''},
    telefono:{ type: String, default:''},
    metodo:{ type: String, default:'codigo'},
    ubicacion: [
    {
        lat:{ type: Number},
        lng:{ type: Number},
    }
    ],
    codigo:{ type: String, default:''},
    
}]);

const Promo = mongoose.model('Promo', promoSchema);

module.exports = Promo;