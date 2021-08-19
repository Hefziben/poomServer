const mongoose = require('mongoose');
const Schema  = mongoose.Schema;

const ordenSchema = new Schema(
    [{
        productos:[],
        usurioId:{ type: String },
        comercioId:{ type: String },
        fecha:{ type: String },
        estado:{ type: String },
        confirmada:{ type: Boolean},
        sub_total:{ type: String },
            envio:{ type: String },
            total:{ type: String },
        ganancia:{ type: String },
        pagado:{ type: String },
        impuestos:{ type: String },
        metodo:{ type: String },
}]);

const Orden = mongoose.model('Orden', ordenSchema);

module.exports = Orden;