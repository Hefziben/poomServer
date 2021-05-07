var express = require("express");
var router = express.Router();
var Comercio = require("../modelos/comercio");
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

/* GET comercios listing. */
router.get("/", function (req, res, next) {
  Comercio.find({}, (err, comercios) => {
    if (res.status == 400) {
      res.send({ mensaje: "error en la petición", res: status, err });
    } else {
      res.send(comercios);
    }
  });
});

//add comercio with file
router.post("/crear", upload.single("file_path"), (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      //process request
      const file = req.file;
      const comercio = req.body;
      const nuevoComercio = {
        nombre: comercio.nombre,
        tipo: comercio.tipo,
        ubicacion: comercio.ubicacion,
        planActivo: comercio.planActivo,
        imagen: file.path,
        promociones: comercio.promociones,
        email: comercio.email,
        website: comercio.website,
        telefono: comercio.telefono,
      };
      console.log(nuevoComercio);
      const crearComercio = new Comercio(nuevoComercio);
      crearComercio.save((err, nuevo_Comercio) => {
        if (err) {
          errMsj = err.message;

          res.send(errMsj);
        } else {
          res.send("Comercio guardado con exito");
        }
      });
    });
  } else {
    res.sendStatus(401);
  }
});

//add comercio
router.post("/", (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }

      //process request
      const crearComercio = new Comercio(req.body);
      crearComercio.save((err, nuevo_Comercio) => {
        if (err) {
          errMsj = err.message;

          res.send(errMsj);
        } else {
          res.send("Comercio guardado con exito");
        }
      });
    });
  } else {
    res.sendStatus(401);
  }
});
//get comercio by ID
router.get("/:id", (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      //process request
      var id = req.params.id;
      Comercio.findOne({ $or: [{ "promociones.codigo": id }, { _id: id }] })
        .exec()
        .then((data) => res.status(200).send(data))
        .catch((err) => res.status(400).send(err));
    });
  } else {
    res.sendStatus(401);
  }
});

//Update Comercio
router.put("/:id", (req, res) => {
  const comercioId = req.params.id;
  console.log(comercioId);

  Comercio.findByIdAndUpdate(comercioId, { $set: req.body }, { new: true })
    .then((data) => res.status(200).send("Actualizado"))
    .catch((err) => res.status(400).send(err));
  // const authHeader = req.headers.authorization;
  // if (authHeader) {
  //   const token = authHeader.split(' ')[1];
  //   jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
  //     if (err) {
  //         return res.sendStatus(403);
  //     }
  // });
  // } else {
  //   res.sendStatus(401);
  // }
});

//Update message with file
router.put("/file/:id", upload.single("file_path"), (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }

      //process request
      const comercioId = req.params.id;
      const file = req.file;
      console.log(file);

      const comercio = req.body;
      console.log(comercioId);
      const update = {
        nombre: comercio.nombre,
        tipo: comercio.tipo,
        ubicacion: comercio.ubicacion,
        planActivo: comercio.planActivo,
        imagen: file.path,
        promociones: comercio.promociones,
        email: comercio.email,
        website: comercio.website,
        telefono: comercio.telefono,
      };
      console.log(comercio);

      Comercio.findByIdAndUpdate(comercioId, { $set: update }, { new: true })
        .then((data) => res.status(200).send("comercio actualizado"))
        .catch((err) => res.status(400).send(err));
    });
  } else {
    res.sendStatus(401);
  }
});

//delete message
router.delete("/:id", (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      //process request
      const messageId = req.params.id;
      Comercio.findByIdAndDelete(messageId)
        .then((data) => res.status(200).send("comercio borrado"))
        .catch((err) => res.status(400).send(err.message));
    });
  } else {
    res.sendStatus(401);
  }
});

module.exports = router;
