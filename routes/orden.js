var express = require("express");
var router = express.Router();
var Orden = require("../modelos/ordenes");
const multer = require("multer");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().getTime() + file.originalname);
  },
});
const upload = multer({
  storage: storage,
});

/* GET ordenes listing. */
router.get("/", function (req, res, next) {
  Orden.find({}, (err, ordenes) => {
    if (res.status == 400) {
      res.send({ mensaje: "error en la petición", res: status, err });
    } else {
      res.send(ordenes);
    }
  });
});



//add orden
router.post("/", (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }

      //process request
      const crearOrden = new Orden(req.body);
      crearOrden.save((err, nuevo_Orden) => {
        if (err) {
          errMsj = err.message;

          res.send(errMsj);
        } else {
          res.send("Orden guardado con exito");
        }
      });
    });
  } else {
    res.sendStatus(401);
  }
});
//add orden with file
router.post("/file", upload.single("file_path"), (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      //process request
      const file = req.file;
      console.log(file);
      let orden = JSON.parse(req.body.orden);
      orden.comprobante = `https://api.poomapp.com/${file.path}`;
      console.log('comprobante',orden.comprobante);
      const crearOrden = new Orden(orden);
      crearOrden.save((err, nueva_orden) => {
        if (err) {
          errMsj = err.message;

          res.send(errMsj);
        } else {
          res.send({mensaje:"Comercio guardado con exito",resp:nueva_orden});
        }
      });
    });
  } else {
    res.sendStatus(401);
  }
});
//get orden by ID
router.get("/:id", (req, res) => {
      //process request
      var id = req.params.id;
      Orden.findOne({ $or: [{ "orden.comercioId": id }, { "orden.usurioId": id }, { _id: id }] })
        .exec()
        .then((data) => res.status(200).send(data))
        .catch((err) => res.status(400).send(err));
  const authHeader = req.headers.authorization;
});

//Update Orden
router.put("/:id", (req, res) => {
  const ordenId = req.params.id;
  console.log(ordenId);

  Orden.findByIdAndUpdate(ordenId, { $set: req.body }, { new: true })
    .then((data) => res.status(200).send("Actualizado"))
    .catch((err) => res.status(400).send(err));
});


//Update orden with file
router.put("/file/:id", upload.single("file_path"), (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }

      //process request
      const ordenId = req.params.id;
      const file = req.file;
      console.log(file);

      let orden = JSON.parse(req.body.orden);
      orden.comprobante = `https://api.poomapp.com/${file.path}`;
 
      console.log(orden);
      Orden.findByIdAndUpdate(ordenId, { $set: orden }, { new: true })
        .then((data) => res.status(200).send({mensaje:"orden actualizada",resp:data}))
        .catch((err) => res.status(400).send(err));
    });
  } else {
    res.sendStatus(401);
  }
});



//delete orden
// router.delete("/:id", (req, res) => {
//   const authHeader = req.headers.authorization;
//   if (authHeader) {
//     const token = authHeader.split(" ")[1];
//     jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
//       if (err) {
//         return res.sendStatus(403);
//       }
//       //process request
//       const messageId = req.params.id;
//       Orden.findByIdAndDelete(messageId)
//         .then((data) => res.status(200).send("orden borrado"))
//         .catch((err) => res.status(400).send(err.message));
//     });
//   } else {
//     res.sendStatus(401);
//   }
// });

module.exports = router;
