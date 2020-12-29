mongoose = require('mongoose');
const Schema  = mongoose.Schema;

const interesSchema = new Schema(
    [{
    name: { type: String,  },
    selected: { type: Boolean, default:false },
}]);

const Interes = mongoose.model('Interes', interesSchema);

module.exports = Interes;