var express = require("express");
var router = express.Router();
var Admin = require("../modelos/admin");

/* GET admin listing. */
router.get("/", function(req, res, next) {
  Admin.find({}, (err, admin) => {
    if (res.status == 400) {
      res.send({ mensaje: "error in get request", res: status, err });
    } else {
      res.send({ mensaje: "Success", res: admin });
    }
  });
});

//create a new admin
router.post("/", (req, res) => {
  const newAdmin = req.body;
  console.log(newAdmin);
  const createAdmin = new Admin(newAdmin);
  createAdmin.save((err, new_Admin) => {
    if (err) {
      res.send({ mensaje: "error in post request", res: status, err });
    } else {
      res.send({ mensaje: "Admin saved", res: new_Admin });
    }
  });
});

//get Admin by ID
router.get("/:id", (req, res) => {
  var adminId = req.params.id;
  Admin.findById(adminId)
    .exec()
    .then(data => res.status(200).send(data))
    .catch(err => res.status(400).send(err));
});
//Update Admin
router.put("/:id", (req, res) => {
  const adminId = req.params.id;
  Admin.findByIdAndUpdate(adminId, { $set: req.body }, { new: true })
    .then(data => res.status(200).send(data))
    .catch(err => res.status(400).send(err));
});

//delete Admin
router.delete("/:id", (req, res) => {
  const adminId = req.params.id;
  Admin.findByIdAndDelete(adminId)
    .then(data => res.status(200).send(data))
    .catch(err => res.status(400).send(err));
});

module.exports = router;
