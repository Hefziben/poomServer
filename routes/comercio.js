var express = require("express");
var router = express.Router();
var Comercio = require("../modelos/comercio");
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

/* GET comercios listing. */
router.get("/", function(req, res, next) {
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
  const file = req.file;
  const comercio = req.body;
  const nuevoComercio = {
    nombre: comercio.nombre,
    tipo: comercio.tipo,
    ubicacion: comercio.ubicacion,    
    planActivo:comercio.planActivo,
    imagen: file.path,
    promociones: comercio.promociones,
    email:comercio.email,
    website: comercio.website,
    telefono:comercio.telefono
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

//add comercio 
router.post("/", (req, res) => {
  if(req.body.batch){
    Comercio.create(req.body.batch, function(err){
      if(err)
        res.send(err);
  
      else
        res.json(req.body);
    });
  } else {
    const crearComercio = new Comercio(req.body);
    crearComercio.save((err, nuevo_Comercio) => {
      if (err) {
        errMsj = err.message;
  
        res.send(errMsj);
      } else {
        res.send("Comercio guardado con exito");
      }
    });
  }
});
//get comercio by ID
router.get("/:id", (req, res) => {
  var comercioId = req.params.id;
  Comercio.findById(comercioId)
    .exec()
    .then(data => res.status(200).send(data))
    .catch(err => res.status(400).send(err));
});

//Update Comercio
router.put("/:id", (req, res) => {
  const comercioId = req.params.id;
  console.log(comercioId);

  Comercio.findByIdAndUpdate(comercioId, { $set: req.body }, { new: true })
    .then(data => res.status(200).send("Actualizado"))
    .catch(err => res.status(400).send(err));
});

//Update message with file
router.put("/file/:id", upload.single("file_path"), (req, res) => {
  const comercioId = req.params.id;
  const file = req.file;
  console.log(file);
  
  const comercio = req.body;
  console.log(comercioId);
  const update = {
    nombre: comercio.nombre,
    tipo: comercio.tipo,
    ubicacion: comercio.ubicacion,    
    planActivo:comercio.planActivo,
    imagen: file.path,
    promociones: comercio.promociones,
    email:comercio.email,
    website: comercio.website,
    telefono:comercio.telefono
  };
  console.log(comercio);
  

  Comercio.findByIdAndUpdate(comercioId, { $set: update }, { new: true })
    .then(data => res.status(200).send("comercio actualizado"))
    .catch(err => res.status(400).send(err));
});

//delete message
router.delete("/:id", (req, res) => {
  const messageId = req.params.id;
  Comercio.findByIdAndDelete(messageId)
    .then(data => res.status(200).send("comercio borrado"))
    .catch(err => res.status(400).send(err.message));
});


module.exports = router;
