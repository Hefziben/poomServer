var express = require("express");
var router = express.Router();
var Mensaje = require("../modelos/mensaje");

/* GET msj listing. */
router.get("/", function(req, res, next) {
    Mensaje.find({}, (err, msj) => {
      if (res.status == 400) {
        res.send({ mensaje: "error in get request", res: err });
      } else {
        res.send({ mensaje: "Success", res: msj });
      }
    });
  });

  //create a new admin
router.post("/", (req, res) => {
    const newMsj = req.body;
    console.log(newMsj);
    const createMsj = new Mensaje(newMsj);
    createMsj.save((err, new_Msj) => {
      if (err) {
        res.send({ mensaje: "error in post request", res: err });
      } else {
        res.send({ mensaje: "Mensaje envido", res: new_Msj });
      }
    });
  });

  module.exports = router;
