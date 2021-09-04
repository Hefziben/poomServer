const mongoose = require('mongoose');
const Schema  = mongoose.Schema;

const ordenSchema = new Schema(
    [{
        ordenNumero:{ type: String },
        productos:[],
        usuario:{ type: Schema.Types.Mixed },
        comercio:{ type: Schema.Types.Mixed },
        fecha:{ type: String },
        estado:{ type: String }, //1. en proceso, 2. confirmada , 3.entregada. 
        sub_total:{ type: String },
            envio:{ type: String },
            total:{ type: String },
        ganancia:{ type: String },
        cargos:{ type: String },
        pagar:{ type: String },
        impuestos:{ type: String },
        metodo:{ type: String },
        comprobante:{ type: String },
        transaccion:{ type: String },
        comentarios:[{
            nota:{ type: String }
        }],
        verificador:{ type: String },
}]);

const Orden = mongoose.model('Orden', ordenSchema);

module.exports = Orden;