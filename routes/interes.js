var express = require("express");
var router = express.Router();
var Interes = require("../modelos/interes");
const multer = require("multer");
const jwt = require('jsonwebtoken');
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

/* GET intereses listing. */
router.get("/", function(req, res, next) {
  Interes.find({}, (err, intereses) => {
    if (res.status == 400) {
      res.send({ mensaje: "error en la petición", res: status, err });
    } else {
      res.send(intereses);
    }
  });
});



//add interes with file
router.post("/", (req, res) => {
   //process request
   const interes = req.body;
   const crearInteres = new Interes(interes);
   crearInteres.save((err, nuevo_Interes) => {
     if (err) {
       errMsj = err.message;
 
       res.send(errMsj);
     } else {
       res.send("Interes guardado con exito");
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


//get interes by ID
router.get("/:id", (req, res) => {
  var interesId = req.params.id;
  Interes.findById(interesId)
    .exec()
    .then(data => res.status(200).send(data))
    .catch(err => res.status(400).send(err));
});

//Update Interes
router.put("/:id", (req, res) => {
  const interesId = req.params.id;
console.log(interesId);

Interes.findByIdAndUpdate(interesId, { $set: req.body }, { new: true })
  .then(data => res.status(200).send("Actualizado"))
  .catch(err => res.status(400).send(err));
//   const authHeader = req.headers.authorization;
//   if (authHeader) {
//     const token = authHeader.split(' ')[1];
//     jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
//       if (err) {
//           return res.sendStatus(403);
//       }
//       if (user.role == "Admin") {
// //process request


        
//       }


//   });
//   } else {
//     res.sendStatus(401);
//   }

});

//Update message with file
router.put("/file/:id", upload.single("file_path"), (req, res) => {
  //process request
const interesId = req.params.id;
const file = req.file;

const interes = req.body;
console.log(interesId);
const update = {
  nombre: interes.nombre,
  imagen: file.path,
};
console.log(update);


Interes.findByIdAndUpdate(interesId, { $set: update }, { new: true })
  .then(data => res.status(200).send("interes actualizado"))
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

//delete interes
router.delete("/:id", (req, res) => {
  //process request
const messageId = req.params.id;
Interes.findByIdAndDelete(messageId)
  .then(data => res.status(200).send("interes borrado"))
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


module.exports = router;
