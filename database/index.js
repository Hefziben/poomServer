// Mongoose
require('dotenv').config()
const mongoose = require("mongoose");
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

// Conectar mongoose con MongoDB
const url = process.env.CREDENTIALS;
// Connect to MongoDB

mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true  });
mongoose.connection.once('open', function(){
  console.log('Conection has been made!');
}).on('error', function(error){
    console.log('Error is: ', error);
});