mongoose = require('mongoose');
const Schema  = mongoose.Schema;

const colegioSchema = new Schema(
    [{
    nombre: { type: String,  },
    tipo: { type: String,  },
    distrito: { type: String,  },
    ubicacion: { type: String, },
    calendario_Escolar: { type: String },
    imagen: { type: String },
    curriculum: { type: String },
    cobertura:{ type: String },
    lengua: { type: String },
    precio: { type: String },
    nosotros: { type: String },
    metodologia: { type: String },
    inclusivo:{ type: String },
    email:{ type: String },
    website:{ type: String },
    telefono:{ type: String },
    actividad:{ type: String },
}]);

const Colegio = mongoose.model('Colegio', colegioSchema);

module.exports = Colegio;