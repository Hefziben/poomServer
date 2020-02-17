// Mongoose
//require('dotenv').config()
const mongoose = require("mongoose");
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

// Conectar mongoose con MongoDB
const url = "mongodb+srv://hefziben:ilive4him@database-ghufx.mongodb.net/bindy?retryWrites=true&w=majority";

const MONGO_USERNAME = 'bindyAdmin';
const MONGO_PASSWORD = 'bindyt2020';
const MONGO_HOSTNAME = 'localhost';
const MONGO_PORT = '27016';
const MONGO_DB = 'bindy';
//const url = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`;

// Connect to MongoDB

mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true  });
mongoose.connection.once('open', function(){
  console.log('Conection has been made!');
}).on('error', function(error){
    console.log('Error is: ', error);
});