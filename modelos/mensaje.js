mongoose = require('mongoose');
const Schema  = mongoose.Schema;

const mensajeSchema = new Schema(
    [{
    nombre: { type: String},
    email: { type: String},
    telefono:{ type: String},
    mensaje: { type: String},
}]);

const Mensaje = mongoose.model('Mensaje', mensajeSchema);

module.exports = Mensaje;