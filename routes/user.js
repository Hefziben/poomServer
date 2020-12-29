var express = require("express");
var router = express.Router();
var User = require("../modelos/user");
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

/* GET User listing. */
router.get("/", function(req, res, next) {
  User.find({}, (err, user) => {
    if (res.status == 400) {
      res.send({ mensaje: "error in get request", res: err });
    } else {
      res.send({ mensaje: "Success", res: user });
    }
  });
});

//create a new user
router.post("/", (req, res) => {
  const newUser = req.body;
  console.log(newUser);
  const createUser = new User(newUser);
  createUser.save((err, new_User) => {
    if (err) {  
      res.send({ mensaje: "error in post request", res: err });
    } else {
      res.send({ mensaje: "User saved", res: new_User });
    }
  });
});

//get User by ID
router.get("/:id", (req, res) => {
  var userId = req.params.id;
  User.findById(userId)
    .exec()
    .then(data => res.status(200).send(data))
    .catch(err => res.status(400).send(err));
});
//Update User
router.put("/:id", (req, res) => {
  const userId = req.params.id;
  User.findByIdAndUpdate(userId, { $set: req.body }, { new: true })
    .then(data => res.status(200).send(data))
    .catch(err => res.status(400).send(err));
});

//Update User with file
router.put("/file/:id", upload.single("file_path"), (req, res) => {
  const userId = req.params.id;
  const file = req.file;
  console.log(file);
  
 
  console.log(userId);
  const update = {
    imagen: file.path,
  };
  console.log(update);
  

  User.findByIdAndUpdate(userId, { $set: update }, { new: true })
    .then(data => res.status(200).send({mensaje:"usuario actualizado",url:data.imagen}))
    .catch(err => res.status(400).send(err));
});

//delete User
router.delete("/:id", (req, res) => {
  const userId = req.params.id;
  User.findByIdAndDelete(userId)
    .then(data => res.status(200).send(data))
    .catch(err => res.status(400).send(err));
});

module.exports = router;
