var express = require("express");
var router = express.Router();
var Promo = require("../modelos/promo");
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
  
  const file = req.file;
  const promo = req.body;
  const nuevaPromo = {
    comercio: promo.comercio,
    validez: promo.validez,
    codigo: promo.codigo,
    ubicacion: promo.ubicacion,
    imagen: file.path,
       };
  console.log(nuevaPromo);
  const crearPromo = new Promo(nuevaPromo);
  crearPromo.save((err, nuevo_Promo) => {
    if (err) {
      errMsj = err.message;

      res.send(errMsj);
    } else {
      res.send("Promo guardado con exito");
    }
  });
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
  const promoId = req.params.id;
  console.log(promoId);

  Promo.findByIdAndUpdate(promoId, { $set: req.body }, { new: true })
    .then(data => res.status(200).send("Actualizado"))
    .catch(err => res.status(400).send(err));
});

//Update message with file
router.put("/file/:id", upload.single("file_path"), (req, res) => {
  const promoId = req.params.id;
  const file = req.file;
  console.log(file);
  
  const promo = req.body;
  console.log(promoId);
  const update = {
    comercio: promo.comercio,
    validez: promo.validez,
    codigo: promo.codigo,
    ubicacion: promo.ubicacion,
    imagen: file.path,
  };
  console.log(update);
  

  Promo.findByIdAndUpdate(promoId, { $set: update }, { new: true })
    .then(data => res.status(200).send("promo actualizado"))
    .catch(err => res.status(400).send(err));
});

//delete message
router.delete("/:id", (req, res) => {
  const messageId = req.params.id;
  Promo.findByIdAndDelete(messageId)
    .then(data => res.status(200).send("promo borrado"))
    .catch(err => res.status(400).send(err.message));
});


module.exports = router;
