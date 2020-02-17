var express = require("express");
var router = express.Router();
var Colegio = require("../modelos/colegio");
const multer = require("multer");

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

/* GET colegios listing. */
router.get("/", function(req, res, next) {
  Colegio.find({}, (err, colegios) => {
    if (res.status == 400) {
      res.send({ mensaje: "error en la petición", res: status, err });
    } else {
      res.send(colegios);
    }
  });
});



//add colegio with file
router.post("/crear", upload.single("file_path"), (req, res) => {
  
  const file = req.file;
  const colegio = req.body;
  const nuevoColegio = {
    nombre: colegio.nombre,
    tipo: colegio.tipo,
    distrito: colegio.distrito,
    ubicacion: colegio.ubicacion,    
    calendario_Escolar:colegio.calendario_Escolar,
    imagen: file.path,
    curriculum: colegio.curriculum,
    cobertura:colegio.cobertura,
    lengua: colegio.lengua,
    precio: colegio.precio,
    nosotros:colegio.nosotros,
    metodologia:colegio.metodologia,
    telefono:colegio.telefono
       };
  console.log(nuevoColegio);
  const crearColegio = new Colegio(nuevoColegio);
  crearColegio.save((err, nuevo_Colegio) => {
    if (err) {
      errMsj = err.message;

      res.send(errMsj);
    } else {
      res.send("Colegio guardado con exito");
    }
  });
});

//add colegio 
router.post("/", (req, res) => {
  if(req.body.batch){
    Colegio.create(req.body.batch, function(err){
      if(err)
        res.send(err);
  
      else
        res.json(req.body);
    });
  } else {
    const crearColegio = new Colegio(req.body);
    crearColegio.save((err, nuevo_Colegio) => {
      if (err) {
        errMsj = err.message;
  
        res.send(errMsj);
      } else {
        res.send("Colegio guardado con exito");
      }
    });
  }
});
//get colegio by ID
router.get("/:id", (req, res) => {
  var colegioId = req.params.id;
  Colegio.findById(colegioId)
    .exec()
    .then(data => res.status(200).send(data))
    .catch(err => res.status(400).send(err));
});

//Update Colegio
router.put("/:id", (req, res) => {
  const colegioId = req.params.id;
  console.log(colegioId);

  Colegio.findByIdAndUpdate(colegioId, { $set: req.body }, { new: true })
    .then(data => res.status(200).send("Actualizado"))
    .catch(err => res.status(400).send(err));
});

//Update message with file
router.put("/file/:id", upload.single("file_path"), (req, res) => {
  const colegioId = req.params.id;
  const file = req.file;
  console.log(file);
  
  const colegio = req.body;
  console.log(colegioId);
  const update = {
    nombre: colegio.nombre,
    tipo: colegio.tipo,
    distrito: colegio.distrito,
    ubicacion: colegio.ubicacion,    
    calendario_Escolar:colegio.calendario_Escolar,
    imagen: file.path,
    curriculum: colegio.curriculum,
    cobertura:colegio.cobertura,
    lengua: colegio.lengua,
    precio: colegio.precio,
    nosotros:colegio.nosotros,
    metodologia:colegio.metodologia,
    telefono:colegio.telefono
  };
  console.log(update);
  

  Colegio.findByIdAndUpdate(colegioId, { $set: update }, { new: true })
    .then(data => res.status(200).send("colegio actualizado"))
    .catch(err => res.status(400).send(err));
});

//delete message
router.delete("/:id", (req, res) => {
  const messageId = req.params.id;
  Colegio.findByIdAndDelete(messageId)
    .then(data => res.status(200).send("colegio borrado"))
    .catch(err => res.status(400).send(err.message));
});

//delete ALL
router.delete("/all", (req, res) => {
  Colegio.findByIdAndDelete(messageId)
    .then(data => res.status(200).send("colegio borrado"))
    .catch(err => res.status(400).send(err.message));
});

module.exports = router;
