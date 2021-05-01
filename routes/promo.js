var express = require("express");
var router = express.Router();
var Promo = require("../modelos/promo");
var Usuarios = require("../modelos/user");
const multer = require("multer");
const jwt = require('jsonwebtoken');

var admin = require("firebase-admin");

var serviceAccount = require("../poom-service-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

require('dotenv').config()

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "uploads");
  },
  filename: function(req, file, cb) {
    cb(null, new Date().getTime() + file.originalname);
  }
});
const upload = multer({
  storage: storage
});

/* GET promos listing. */
router.get("/", function(req, res, next) {
  Promo.find({}, (err, promos) => {
    if (res.status == 400) {
      res.send({ mensaje: "error en la petición", res: status, err });
    } else {
      res.send(promos);
    }
  });
});



//add promo
router.post("/", upload.single("file_path"), (req, res) => {
  //process request  
const file = req.file;
const promo = req.body;
const nuevaPromo = {
  comercio: promo.comercio,
  validez: promo.validez,
  codigo: promo.codigo,
  categoria:promo.categoria,
  telefono:promo.telefono,
  ubicacion: [{lat:Number(promo.lat),lng:Number(promo.lng)}],
  imagen: file.path,
     };
const crearPromo = new Promo(nuevaPromo);
crearPromo.save((err, nuevo_Promo) => {
  if (err) {
    errMsj = err.message;

    res.send(errMsj);
  } else {
    Usuarios.find({'intereses.name':promo.categoria}, (err, usuarios) => {

      if (res.status == 400) {
        res.send({ mensaje: "error en la petición", res: status, err });
      } else {
        let tokens = []
        for (const item of usuarios) {
          if (item.msgToken) {
            tokens.push(item.msgToken)
          }
        }
        postNotification(promo.comercio,tokens,notificacion)
        res.send({ msg:"Promo guardado con exito", id:nuevo_Promo});
      }
    });

  }
});
  // const authHeader = req.headers.authorization;
  // if (authHeader) {
  //   const token = authHeader.split(' ')[1];
  //   jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
  //     if (err) {
  //         return res.sendStatus(403);
  //     }
  //     if (user.role == "Admin") {

        
  //     }


  // });
  // } else {
  //   res.sendStatus(401);
  // }


});


//get promo by ID
router.get("/:id", (req, res) => {
  var promoId = req.params.id;
  Promo.findById(promoId)
    .exec()
    .then(data => res.status(200).send(data))
    .catch(err => res.status(400).send(err));
});

//Update Promo
router.put("/:id", (req, res) => {
  //process request
const promoId = req.params.id;
console.log(promoId);
Promo.findByIdAndUpdate(promoId, { $set: req.body }, { new: true })
  .then(data => res.status(200).send("Actualizado"))
  .catch(err => res.status(400).send(err));
  // const authHeader = req.headers.authorization;
  // if (authHeader) {
  //   const token = authHeader.split(' ')[1];
  //   jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
  //     if (err) {
  //         return res.sendStatus(403);
  //     }
  //     if (user.role == "Admin") {

  //     }


  // });
  // } else {
  //   res.sendStatus(401);
  // }


});

//Update message with file
router.put("/file/:id", upload.single("file_path"), (req, res) => {
  //process request
const promoId = req.params.id;
const file = req.file;
console.log(file);

const promo = req.body;
console.log(promoId);
const update = {
  categoria: promo.categoria,
  validez: promo.validez,
  imagen: file.path,
  telefono:promo.telefono
};
console.log(update);


Promo.findByIdAndUpdate(promoId, { $set: update }, { new: true })
  .then(data => res.status(200).send("promo actualizado"))
  .catch(err => res.status(400).send(err));
  // const authHeader = req.headers.authorization;
  // if (authHeader) {
  //   const token = authHeader.split(' ')[1];
  //   jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
  //     if (err) {
  //         return res.sendStatus(403);
  //     }
  //     if (user.role == "Admin") {

  //     }


  // });
  // } else {
  //   res.sendStatus(401);
  // }


});

//delete message
router.delete("/:id", (req, res) => {
  //process request
const messageId = req.params.id;
Promo.findByIdAndDelete(messageId)
  .then(data => res.status(200).send("promo borrado"))
  .catch(err => res.status(400).send(err.message));
  // const authHeader = req.headers.authorization;
  // if (authHeader) {
  //   const token = authHeader.split(' ')[1];
  //   jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
  //     if (err) {
  //         return res.sendStatus(403);
  //     }
  //     if (user.role == "Admin") {

  //     }


  // });
  // } else {
  //   res.sendStatus(401);
  // }


});

function postNotification(comercio,tokens,notificacion){
  var registrationToken = tokens;
  var payload = {
    notification: {
      title: "Nueva Promoción",
      body: `Hola, ${comercio} ${notificacion}.`,
      icon:"https://poomapp.com/assets/image/logo_poom_naranja.svg"
    }
  }
  admin.messaging().sendToDevice(registrationToken, payload)
  .then(function(response) {
    console.log("Successfully sent message:", response);
  })
  .catch(function(error) {
    console.log("Error sending message:", error);
  });
}

//postNotification();

module.exports = router;
