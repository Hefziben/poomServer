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
    imagen: { type: String },
    email:{ type: String },
    website:{ type: String },
    telefono:{ type: String }
}]);

const Comercio = mongoose.model('Comercio', comercioSchema);

module.exports = Comercio;